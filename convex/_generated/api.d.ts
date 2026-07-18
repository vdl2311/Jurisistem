export declare const api: {
  users: {
    listTeam: any;
    createUser: any;
    getByEmail: any;
  },
  clients: {
    list: any;
    getById: any;
    create: any;
    update: any;
    remove: any;
  },
  processes: {
    list: any;
    getByNumber: any;
    create: any;
    updateStatus: any;
  },
  deadlines: {
    list: any;
    create: any;
    complete: any;
  },
  dashboard: {
    getStats: any;
  },
  tasks: {
    list: any;
    create: any;
    updateStatus: any;
  },
  financial: {
    list: any;
    create: any;
    markAsPaid: any;
  },
  notifications: {
    listByUser: any;
    create: any;
    markAsRead: any;
    markAllAsRead: any;
  },
  events: {
    listByUser: any;
    create: any;
    update: any;
    remove: any;
  },
  actions: {
    datajudSearch: any;
  },
  mocks: {
    getAgents: any;
    runAgent: any;
    getAutomations: any;
    getConflicts: any;
    getAdminStats: any;
    syncDatajud: any;
    getPortalData: any;
    getKnowledge: any;
    getCompliance: any;
    getContracts: any;
    getTemplates: any;
    runCopilot: any;
    runAiPeticao: any;
    runAiRevisao: any;
    runAiJurisprudencia: any;
  }
};
