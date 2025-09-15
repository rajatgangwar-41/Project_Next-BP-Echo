import z from "zod";
import { createTool, saveMessage } from "@convex-dev/agent";
import { components, internal } from "../../../_generated/api";

export const escalateConversation = createTool({
  description: "Escalate a conversation",
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });

    await saveMessage(ctx, components.agent, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Conversation escalated to a human operator",
      },
    });

    return "Conversation escalated to a human operator";
  },
});
