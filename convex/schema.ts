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

  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.string(), // "info", "warning", "error", "success"
    read: v.boolean(),
    link: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    start: v.number(),
    end: v.number(),
    type: v.string(), // "Audiência", "Reunião", "Prazo", "Outro"
    location: v.optional(v.string()),
    processId: v.optional(v.id("processes")),
    userId: v.string(),
    createdAt: v.number(),
  }).index("by_user_time", ["userId", "start"]),

  clients: defineTable({
    name: v.string(),
    type: v.string(),
    document: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    mobile: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    status: v.string(),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    dueDate: v.optional(v.number()),
    assignee: v.optional(v.string()),
    processId: v.optional(v.id("processes")),
    clientId: v.optional(v.id("clients")),
    createdAt: v.number(),
  }),

  financials: defineTable({
    type: v.string(),
    category: v.string(),
    description: v.string(),
    amount: v.number(),
    dueDate: v.number(),
    paidDate: v.optional(v.number()),
    status: v.string(),
    processId: v.optional(v.id("processes")),
    clientId: v.optional(v.id("clients")),
    createdAt: v.number(),
  }),
});
