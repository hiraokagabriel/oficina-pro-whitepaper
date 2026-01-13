import React, { useState } from 'react';
import { DatabaseProvider } from './context/DatabaseContext';
import { KanbanBoard } from './components/KanbanBoard';
import { WorkOrderModal } from './components/WorkOrderModal';
import { ClientsTab } from './components/ClientsTab';
import { FinancialDashboard } from './components/FinancialDashboard';
import { SettingsTab } from './components/SettingsTab';
import { ReportsTab } from './components/ReportsTab';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import './styles/globals.css';
import './styles/App.css';

type TabType = 'kanban' | 'clients' | 'financial' | 'reports' | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('kanban');
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const { toasts, removeToast } = useToast();

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="app-header">
        <div className="app-header-content">
          <h1 className="app-title">🔧 Oficina PRO ERP</h1>
          <p className="app-subtitle">Sistema de Gestão de Oficina Mecânica</p>
        </div>
        <button
          className="btn-primary btn-lg"
          onClick={() => setIsWorkOrderModalOpen(true)}
        >
          ➕ Nova O.S.
        </button>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`nav-item ${activeTab === 'kanban' ? 'active' : ''}`}
          onClick={() => setActiveTab('kanban')}
        >
          📋 Ordens de Serviço
        </button>
        <button
          className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          👥 Clientes
        </button>
        <button
          className={`nav-item ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          💰 Financeiro
        </button>
        <button
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📊 Relatórios
        </button>
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Configurações
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'clients' && <ClientsTab />}
        {activeTab === 'financial' && <FinancialDashboard />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Modals */}
      <WorkOrderModal
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}

export default App;
