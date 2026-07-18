import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { status: v.optional(v.string()), assignee: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let tasks = await ctx.db.query("tasks").order("desc").collect();
    
    if (args.status && args.status !== "Todas") {
      tasks = tasks.filter(t => t.status === args.status);
    }
    
    if (args.assignee && args.assignee !== "Todos") {
      tasks = tasks.filter(t => t.assignee === args.assignee);
    }
    
    return tasks;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    dueDate: v.optional(v.number()),
    assignee: v.optional(v.string()),
    processId: v.optional(v.id("processes")),
    clientId: v.optional(v.id("clients")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    assignee: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
