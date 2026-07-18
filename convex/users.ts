import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.string(),
    permissions: v.string(),
    externalId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role,
      permissions: args.permissions,
      externalId: args.externalId,
      createdAt: Date.now(),
    });
  },
});

export const listTeam = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
