import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { action, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { listMessages } from "@convex-dev/agent";

export const create: ReturnType<typeof action> = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId,
      },
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: args.threadId,
      },
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.contactSessionId !== contactSession._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Incorrect session",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation resolved",
      });
    }

    const message = await supportAgent.generateText(
      ctx,
      { threadId: args.threadId },
      { prompt: args.prompt },
    );
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const paginatedMessages = await listMessages(ctx, components.agent, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginatedMessages;
  },
});
