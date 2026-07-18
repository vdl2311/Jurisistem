import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("clients").collect();
    const processes = await ctx.db.query("processes").collect();
    const deadlines = await ctx.db.query("deadlines").collect();
    const tasks = await ctx.db.query("tasks").collect();
    const financial = await ctx.db.query("financial").collect();

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const deadlinesToday = deadlines.filter(d => {
      const dt = new Date(d.dueDate);
      return dt >= today && dt < tomorrow;
    });

    const activeProcesses = processes.filter(p => p.status === "Ativo");
    const activeClients = clients.filter(c => c.status === "Ativo");

    // Financeiro simplificado
    const totalRevenue = financial
      .filter(f => f.type === "Receita" && f.status === "Pago")
      .reduce((sum, f) => sum + f.amount, 0);
    
    const totalExpenses = financial
      .filter(f => f.type === "Despesa" && f.status === "Pago")
      .reduce((sum, f) => sum + f.amount, 0);

    return {
      resumo: {
        processosAtivos: activeProcesses.length,
        processosEncerrados: processes.length - activeProcesses.length,
        clientesAtivos: activeClients.length,
        prazosHoje: deadlinesToday.length,
        prazos7Dias: deadlines.filter(d => {
          const dt = new Date(d.dueDate);
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return dt >= today && dt <= nextWeek;
        }).length,
        tarefasPendentes: tasks.filter(t => t.status !== "Concluído").length,
        recebidoMes: totalRevenue,
        despesasMes: totalExpenses,
        aReceber: financial.filter(f => f.type === "Receita" && f.status !== "Pago").reduce((sum, f) => sum + f.amount, 0),
      },
      prazosDeHoje: deadlinesToday.slice(0, 5).map(d => ({
        id: d._id,
        title: d.title,
        priority: d.priority,
        processId: d.processId,
        processNumber: d.processNumber
      })),
      processosPorArea: Array.from(
        processes.reduce((acc, p) => {
          acc.set(p.category, (acc.get(p.category) || 0) + 1);
          return acc;
        }, new Map<string, number>())
      ).map(([area, total]) => ({ area, total })),
      graficoMensal: [
        { mes: "Atual", receita: totalRevenue, despesa: totalExpenses }
      ]
    };
  },
});
