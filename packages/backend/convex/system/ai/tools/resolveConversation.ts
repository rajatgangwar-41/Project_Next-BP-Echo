import z from "zod";
import { createTool, saveMessage } from "@convex-dev/agent";
import { components, internal } from "../../../_generated/api";

export const resolveConversation = createTool({
  description: "Resolve a conversation",
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    await ctx.runMutation(internal.system.conversations.resolve, {
      threadId: ctx.threadId,
    });

    await saveMessage(ctx, components.agent, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Conversation resolved",
      },
    });

    return "Conversation resolved";
  },
});
