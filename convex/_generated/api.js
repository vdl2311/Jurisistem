export const api = {
  users: {
    listTeam: "users:listTeam",
    createUser: "users:createUser",
    getByEmail: "users:getByEmail",
  },
  clients: {
    list: "clients:list",
    getById: "clients:getById",
    create: "clients:create",
    update: "clients:update",
    remove: "clients:remove",
  },
  processes: {
    list: "processes:list",
    getByNumber: "processes:getByNumber",
    create: "processes:create",
    updateStatus: "processes:updateStatus",
  },
  deadlines: {
    list: "deadlines:list",
    create: "deadlines:create",
    complete: "deadlines:complete",
  },
  dashboard: {
    getStats: "dashboard:getStats",
  },
  tasks: {
    list: "tasks:list",
    create: "tasks:create",
    updateStatus: "tasks:updateStatus",
  },
  financial: {
    list: "financial:list",
    create: "financial:create",
    markAsPaid: "financial:markAsPaid",
  },
  notifications: {
    listByUser: "notifications:listByUser",
    create: "notifications:create",
    markAsRead: "notifications:markAsRead",
    markAllAsRead: "notifications:markAllAsRead",
  },
  events: {
    listByUser: "events:listByUser",
    create: "events:create",
    update: "events:update",
    remove: "events:remove",
  },
  actions: {
    datajudSearch: "actions:datajudSearch",
  }
};
