"use client";

import { z } from "zod";
import { toast } from "sonner";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField } from "@workspace/ui/components/form";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@workspace/ui/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
} from "@workspace/ui/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@workspace/ui/components/ai-elements/prompt-input";
import { Response } from "@workspace/ui/components/ai-elements/response";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ConversationStatusButton } from "../components/conversations-status-button";
import React from "react";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const [isEnhancing, setIsEnhancing] = React.useState(false);
  const enhanceResponse = useAction(api.private.messages.enhanceResponse);

  const handleEnhanceResponse = async () => {
    setIsEnhancing(true);
    const currentValue = form.getValues("message");

    try {
      const response = await enhanceResponse({ prompt: currentValue });
      form.setValue("message", response);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const createMessage = useMutation(api.private.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message,
      });

      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus,
  );
  const handleToggleStatus = async () => {
    if (!conversation) {
      return;
    }

    setIsUpdatingStatus(true);

    let newStatus: "unresolved" | "resolved" | "escalated";

    // Cycle through statuses: unresolved -> escalated -> resolved -> unresolved
    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }

    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (conversation === undefined || messages.status === "LoadingFirstPage") {
    return <ConversationIdViewLoading />;
  }

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
        {!!conversation && (
          <ConversationStatusButton
            onClick={handleToggleStatus}
            status={conversation.status}
            disabled={isUpdatingStatus}
          />
        )}
      </header>
      <Conversation className="max-h-[calc(100vh-180px)]">
        <ConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => (
            <Message
              // In reverse, because we are watching from "assistant" prespective
              from={message.role === "user" ? "assistant" : "user"}
              key={message.id}
            >
              <MessageContent>
                <Response>{message.text}</Response>
              </MessageContent>
              {message.role === "user" && (
                <DicebearAvatar
                  seed={conversation?.contactSessionId ?? "user"}
                  size={32}
                />
              )}
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="p-2">
        <Form {...form}>
          <PromptInput onSubmit={() => form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <PromptInputTextarea
                  value={field.value}
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved"
                      : "Type your response as an operator..."
                  }
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting ||
                    isEnhancing
                  }
                />
              )}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton
                  onClick={handleEnhanceResponse}
                  disabled={
                    conversation?.status === "resolved" ||
                    isEnhancing ||
                    !form.formState.isValid
                  }
                >
                  <Wand2Icon />
                  {isEnhancing ? "Enhancing..." : "Enhance"}
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  isEnhancing
                }
                status="ready"
                type="submit"
              />
            </PromptInputToolbar>
          </PromptInput>
        </Form>
      </div>
    </div>
  );
};

export const ConversationIdViewLoading = () => {
  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button disabled size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>
      <Conversation className="max-h-[calc(100vh-180px)]">
        <ConversationContent>
          {Array.from({ length: 8 }, (_, index) => {
            const isUser = index % 2 === 0;
            const widths = ["w-48", "w-60", "w-72"];
            const width = widths[index % widths.length];

            return (
              <div
                className={cn(
                  "group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse",
                )}
                key={index}
              >
                <Skeleton
                  className={`h-9 ${width} rounded-lg bg-neutral-200`}
                />
                <Skeleton className="size-8 rounded-full bg-neutral-200" />
              </div>
            );
          })}
        </ConversationContent>
      </Conversation>
      <div className="p-2">
        <PromptInput onSubmit={() => {}}>
          <PromptInputTextarea
            disabled
            placeholder="Type your response as an operator..."
          />
          <PromptInputToolbar>
            <PromptInputTools />
            <PromptInputSubmit disabled status="ready" />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};
