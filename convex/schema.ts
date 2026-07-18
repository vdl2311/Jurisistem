import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(), // e.g., "Admin", "Advogado", "Secretária"
    permissions: v.string(), // comma-separated or JSON
    oab: v.optional(v.string()),
    createdAt: v.number(),
    lastLogin: v.optional(v.number()),
    externalId: v.optional(v.string()), // Firebase UID
  }).index("by_email", ["email"]),

  invites: defineTable({
    email: v.string(),
    role: v.string(),
    permissions: v.string(),
    status: v.string(), // "pending", "accepted", "expired"
    invitedBy: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  auditLogs: defineTable({
    userId: v.string(),
    action: v.string(),
    details: v.string(),
    timestamp: v.number(),
  }),
});
