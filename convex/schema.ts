import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(),
    permissions: v.string(),
    oab: v.optional(v.string()),
    createdAt: v.number(),
    lastLogin: v.optional(v.number()),
    externalId: v.optional(v.string()),
  }).index("by_email", ["email"]),

  clients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    cpfCnpj: v.string(),
    type: v.string(), // "Pessoa Física" | "Pessoa Jurídica"
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.string(), // "Ativo" | "Inativo"
    createdAt: v.number(),
  }).index("by_cpfCnpj", ["cpfCnpj"]),

  processes: defineTable({
    number: v.string(),
    title: v.string(),
    clientName: v.string(),
    clientId: v.optional(v.id("clients")),
    court: v.string(), // Tribunal
    instance: v.string(), // Instância
    status: v.string(), // "Ativo" | "Suspenso" | "Arquivado"
    priority: v.string(), // "Baixa" | "Média" | "Alta" | "Urgente"
    category: v.string(), // "Cível" | "Trabalhista" | etc
    value: v.optional(v.number()),
    distributionDate: v.optional(v.number()),
    lastMovement: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_number", ["number"]),

  deadlines: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.number(),
    processId: v.optional(v.id("processes")),
    processNumber: v.optional(v.string()),
    status: v.string(), // "Pendente" | "Concluído" | "Atrasado"
    priority: v.string(),
    assignedTo: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_due_date", ["dueDate"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    dueDate: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")),
    processId: v.optional(v.id("processes")),
    createdAt: v.number(),
  }),

  financial: defineTable({
    type: v.string(), // "Receita" | "Despesa"
    description: v.string(),
    value: v.number(),
    date: v.number(),
    status: v.string(), // "Pago" | "Pendente"
    category: v.string(),
    clientId: v.optional(v.id("clients")),
    processId: v.optional(v.id("processes")),
    createdAt: v.number(),
  }).index("by_date", ["date"]),

  auditLogs: defineTable({
    userId: v.string(),
    action: v.string(),
    details: v.string(),
    timestamp: v.number(),
  }),
});
