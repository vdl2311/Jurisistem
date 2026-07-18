import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("processes").order("desc").collect();
  },
});

export const getByNumber = query({
  args: { number: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("processes")
      .withIndex("by_number", (q) => q.eq("number", args.number))
      .unique();
  },
});

export const create = mutation({
  args: {
    number: v.string(),
    title: v.string(),
    clientName: v.string(),
    clientId: v.optional(v.id("clients")),
    court: v.string(),
    instance: v.string(),
    category: v.string(),
    priority: v.string(),
    value: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("processes", {
      ...args,
      status: "Ativo",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("processes"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
