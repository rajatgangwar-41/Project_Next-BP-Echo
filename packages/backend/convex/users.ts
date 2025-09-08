import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUsers = query({
  args: {},
  handler: async (ctx, _args) => {
    return await ctx.db.query("users").collect();
  },
});

export const addUser = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const orgId = identity?.orgId as string;

    if (!orgId) throw new Error("Missing Organization");

    throw new Error("Testing Error");

    return await ctx.db.insert("users", { ...args });
  },
});
