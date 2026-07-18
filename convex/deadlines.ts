import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("deadlines").order("asc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.number(),
    processId: v.optional(v.id("processes")),
    processNumber: v.optional(v.string()),
    priority: v.string(),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("deadlines", {
      ...args,
      status: "Pendente",
      createdAt: Date.now(),
    });
  },
});

export const complete = mutation({
  args: { id: v.id("deadlines") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "Concluído" });
  },
});
