import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { type: v.optional(v.string()), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("financials").order("desc").collect();
    
    if (args.type && args.type !== "Todos") {
      items = items.filter(i => i.type === args.type);
    }
    
    if (args.status && args.status !== "Todos") {
      items = items.filter(i => i.status === args.status);
    }
    
    return items;
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    category: v.string(),
    description: v.string(),
    amount: v.number(),
    dueDate: v.number(),
    paidDate: v.optional(v.number()),
    status: v.string(),
    processId: v.optional(v.id("processes")),
    clientId: v.optional(v.id("clients")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("financials", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("financials"),
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    paidDate: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
