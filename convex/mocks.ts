import { query, action, mutation } from "./_generated/server";
import { v } from "convex/values";

// A generic query to return empty arrays or simple mocked data
export const getAgents = query({
  handler: async () => {
    return [];
  },
});

export const runAgent = action({
  args: { agentId: v.string(), prompt: v.string() },
  handler: async () => {
    return { success: true, message: "Agent run initiated via Convex" };
  },
});

export const getAutomations = query({
  handler: async () => {
    return [];
  },
});

export const getConflicts = query({
  handler: async () => {
    return [];
  },
});

export const getAdminStats = query({
  handler: async () => {
    return { users: 0, processes: 0 };
  },
});

export const syncDatajud = action({
  handler: async () => {
    return { success: true, message: "Sync initiated via Convex" };
  },
});

export const getPortalData = query({
  args: { token: v.string() },
  handler: async () => {
    return { client: null, cases: [] };
  },
});

export const getKnowledge = query({
  handler: async () => {
    return [];
  },
});

export const getCompliance = query({
  handler: async () => {
    return [];
  },
});

export const getContracts = query({
  handler: async () => {
    return [];
  },
});

export const getTemplates = query({
  handler: async () => {
    return [];
  },
});

export const runCopilot = action({
  args: { prompt: v.string(), context: v.optional(v.any()) },
  handler: async () => {
    return { text: "Resposta via Convex Copilot (Mock)" };
  },
});

export const runAiPeticao = action({
  args: { params: v.any() },
  handler: async () => {
    return { text: "Petição gerada via Convex Action" };
  },
});

export const runAiRevisao = action({
  args: { text: v.string() },
  handler: async () => {
    return { text: "Revisão gerada via Convex Action" };
  },
});

export const runAiJurisprudencia = action({
  args: { query: v.string() },
  handler: async () => {
    return { results: [] };
  },
});
