'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { CommandPalette } from '@/components/command-palette'
import { LoginScreen } from '@/components/login-screen'
import { DashboardView } from '@/components/views/dashboard-view'
import { ProcessesView } from '@/components/views/processes-view'
import { ProcessDetail } from '@/components/views/process-detail'
import { ClientsView } from '@/components/views/clients-view'
import { DeadlinesView } from '@/components/views/deadlines-view'
import { TasksView } from '@/components/views/tasks-view'
import { FinancialView } from '@/components/views/financial-view'
import { CopilotView } from '@/components/views/copilot-view'
import { AgendaView } from '@/components/views/agenda-view'
import { TeamView } from '@/components/views/team-view'
import { AdminView } from '@/components/views/admin-view'
import { ReportsView } from '@/components/views/reports-view'
import { ContractsView } from '@/components/views/contracts-view'
import { AutomationsView } from '@/components/views/automations-view'
import { PortalView } from '@/components/views/portal-view'
import { NotificationsView } from '@/components/views/notifications-view'
import { AiJuridicaView } from '@/components/views/ai-juridica-view'
import { ConflictsView } from '@/components/views/conflicts-view'
import { DatajudView } from '@/components/views/datajud-view'
import { AgentsView } from '@/components/views/agents-view'
import { KnowledgeView } from '@/components/views/knowledge-view'
import { ComplianceView } from '@/components/views/compliance-view'

export type ViewName =
  | 'dashboard'
  | 'processes'
  | 'process-detail'
  | 'clients'
  | 'deadlines'
  | 'tasks'
  | 'financial'
  | 'copilot'
  | 'ai-juridica'
  | 'agenda'
  | 'team'
  | 'admin'
  | 'reports'
  | 'contracts'
  | 'documents'
  | 'automations'
  | 'portal'
  | 'notifications'
  | 'conflicts'
  | 'datajud'
  | 'agents'
  | 'knowledge'
  | 'compliance'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [view, setView] = useState<ViewName>('dashboard')
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [commandOpen, setCommandOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Persistir sessão
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('jusflow_user') : null
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
  }, [])

  const handleLogin = (u: User) => {
    setUser(u)
    if (typeof window !== 'undefined') localStorage.setItem('jusflow_user', JSON.stringify(u))
  }

  const handleLogout = () => {
    setUser(null)
    if (typeof window !== 'undefined') localStorage.removeItem('jusflow_user')
  }

  // Atalho Cmd+K
  useEffect(() => {
    if (!user) return
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [user])

  // Listener para eventos de navegação global
  useEffect(() => {
    if (!user) return
    const navigateHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail as ViewName
      if (detail) setView(detail)
    }
    const openDatajudHandler = () => {}
    window.addEventListener('navigate', navigateHandler)
    window.addEventListener('open-datajud', openDatajudHandler)
    return () => {
      window.removeEventListener('navigate', navigateHandler)
      window.removeEventListener('open-datajud', openDatajudHandler)
    }
  }, [user])

  const openProcess = useCallback((id: string) => {
    setSelectedProcessId(id)
    setView('process-detail')
    setMobileSidebarOpen(false)
  }, [])

  const openClient = useCallback((id: string) => {
    setSelectedClientId(id)
    setView('clients')
    setMobileSidebarOpen(false)
  }, [])

  const navigate = useCallback((v: ViewName) => {
    setView(v)
    setMobileSidebarOpen(false)
  }, [])

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Portal do cliente é tela cheia (sem sidebar)
  if (view === 'portal') {
    return <PortalView />
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <div className="hidden md:flex">
        <Sidebar
          current={view}
          onNavigate={navigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      {/* Sidebar mobile (drawer com overlay) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-in slide-in-from-left duration-200">
            <Sidebar
              current={view}
              onNavigate={navigate}
              collapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          onOpenSearch={() => setCommandOpen(true)}
          onOpenCopilot={() => setView('copilot')}
          view={view}
          user={user}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {view === 'dashboard' && (
            <DashboardView onOpenProcess={openProcess} onNavigate={navigate} />
          )}
          {view === 'processes' && (
            <ProcessesView onOpenProcess={openProcess} onNavigate={navigate} />
          )}
          {view === 'process-detail' && selectedProcessId && (
            <ProcessDetail
              processId={selectedProcessId}
              onBack={() => setView('processes')}
              onOpenClient={openClient}
            />
          )}
          {view === 'clients' && (
            <ClientsView selectedId={selectedClientId} onOpenProcess={openProcess} />
          )}
          {view === 'deadlines' && <DeadlinesView onOpenProcess={openProcess} />}
          {view === 'tasks' && <TasksView onOpenProcess={openProcess} />}
          {view === 'financial' && <FinancialView />}
          {view === 'copilot' && (
            <CopilotView onOpenProcess={openProcess} onNavigate={navigate} />
          )}
          {view === 'ai-juridica' && <AiJuridicaView />}
          {view === 'agenda' && <AgendaView onOpenProcess={openProcess} />}
          {view === 'team' && <TeamView />}
          {view === 'admin' && <AdminView />}
          {view === 'reports' && <ReportsView />}
          {view === 'contracts' && <ContractsView />}
          {view === 'documents' && <DocumentsView />}
          {view === 'automations' && <AutomationsView />}
          {view === 'notifications' && <NotificationsView />}
          {view === 'conflicts' && <ConflictsView />}
          {view === 'datajud' && <DatajudView />}
          {view === 'agents' && <AgentsView />}
          {view === 'knowledge' && <KnowledgeView />}
          {view === 'compliance' && <ComplianceView />}
        </main>
      </div>

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onOpenProcess={openProcess}
        onNavigate={navigate}
      />
    </div>
  )
}

function DocumentsView() {
  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg border border-border p-8 md:p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo de documentos integrado aos processos e contratos. Acesse via detalhe do processo ou pelo módulo de Contratos.
        </p>
      </div>
    </div>
  )
}
