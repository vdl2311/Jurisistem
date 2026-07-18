import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByUser = query({
  args: { userId: v.string(), start: v.number(), end: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_user_time", (q) => 
        q.eq("userId", args.userId).gt("start", args.start).lt("start", args.end)
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    start: v.number(),
    end: v.number(),
    type: v.string(),
    location: v.optional(v.string()),
    processId: v.optional(v.id("processes")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    start: v.optional(v.number()),
    end: v.optional(v.number()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
