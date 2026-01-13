import React, { useState } from 'react';
import { DatabaseProvider } from './context/DatabaseContext';
import { KanbanBoard } from './components/KanbanBoard';
import { ActiveTab, WorkOrder, UIState } from './types/index';
import './styles/globals.css';
import './styles/App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workshop');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-content">
          <h1 className="app-title">Oficina PRO</h1>
          <p className="app-subtitle">Sistema de Gerenciamento de Oficina Mecânica</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'workshop' ? 'active' : ''}`}
          onClick={() => setActiveTab('workshop')}
        >
          🔧 Oficina
        </button>
        <button
          className={`nav-btn ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          💰 Financeiro
        </button>
        <button
          className={`nav-btn ${activeTab === 'crm' ? 'active' : ''}`}
          onClick={() => setActiveTab('crm')}
        >
          👥 CRM
        </button>
        <button
          className={`nav-btn ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          ⚙️ Configurações
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'workshop' && (
          <div className="tab-content">
            <section className="section-header">
              <h2>Ordens de Serviço</h2>
              <button className="btn-primary">+ Nova O.S.</button>
            </section>
            <KanbanBoard onSelectWorkOrder={setSelectedWorkOrder} />
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="tab-content">
            <section className="section-header">
              <h2>Gestão Financeira</h2>
              <div className="financial-actions">
                <button className="btn-primary">+ Receita</button>
                <button className="btn-primary">+ Despesa</button>
              </div>
            </section>
            <div className="placeholder-content">
              <p>Módulo de gestão financeira em desenvolvimento...</p>
            </div>
          </div>
        )}

        {activeTab === 'crm' && (
          <div className="tab-content">
            <section className="section-header">
              <h2>CRM - Gestão de Clientes</h2>
              <button className="btn-primary">+ Novo Cliente</button>
            </section>
            <div className="placeholder-content">
              <p>Módulo de CRM em desenvolvimento...</p>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="tab-content">
            <section className="section-header">
              <h2>Configurações</h2>
            </section>
            <div className="placeholder-content">
              <p>Módulo de configurações em desenvolvimento...</p>
            </div>
          </div>
        )}
      </main>
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
