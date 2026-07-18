import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("financial").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    description: v.string(),
    amount: v.float64(),
    type: v.string(), // "Receita" | "Despesa"
    category: v.string(),
    dueDate: v.string(),
    clientId: v.optional(v.string()),
    clientName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const entryId = await ctx.db.insert("financial", {
      ...args,
      status: "Pendente",
      createdAt: Date.now(),
    });
    return entryId;
  },
});

export const markAsPaid = mutation({
  args: { id: v.id("financial") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "Pago" });
  },
});
