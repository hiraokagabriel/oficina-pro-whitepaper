import React, { useState } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import {
  exportWorkOrdersToCSV,
  exportClientsToCSV,
  exportLedgerToCSV,
  exportFinancialReportCSV,
} from '../utils/csvExport';
import '../styles/Reports.css';

export function ReportsTab() {
  const db = useDatabaseContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleExport = (type: string) => {
    try {
      switch (type) {
        case 'workOrders':
          exportWorkOrdersToCSV(db.workOrders, db.clients);
          setExportStatus('✅ Ordens de serviço exportadas!');
          break;
        case 'clients':
          exportClientsToCSV(db.clients);
          setExportStatus('✅ Clientes exportados!');
          break;
        case 'ledger':
          exportLedgerToCSV(db.ledger);
          setExportStatus('✅ Lançamentos exportados!');
          break;
        case 'financial':
          exportFinancialReportCSV(db.ledger, selectedMonth, selectedYear);
          setExportStatus('✅ Relatório financeiro exportado!');
          break;
      }
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      setExportStatus('❌ Erro ao exportar!');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="reports-tab">
      <div className="dashboard-header">
        <h2>📊 Relatórios e Exportação</h2>
        {exportStatus && (
          <div className="export-status">{exportStatus}</div>
        )}
      </div>

      {/* Estatísticas */}
      <section className="reports-section">
        <h3>📊 Estatísticas Gerais</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{db.workOrders.length}</div>
            <div className="stat-label">Ordens de Serviço</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{db.clients.length}</div>
            <div className="stat-label">Clientes Cadastrados</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">{db.ledger.length}</div>
            <div className="stat-label">Lançamentos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">
              {db.workOrders.filter((wo) => wo.status === 'concluido').length}
            </div>
            <div className="stat-label">O.S. Concluídas</div>
          </div>
        </div>
      </section>

      {/* Exportações Rápidas */}
      <section className="reports-section">
        <h3>📥 Exportações Rápidas (CSV)</h3>
        <div className="export-grid">
          <div className="export-card">
            <div className="export-icon">📋</div>
            <h4>Ordens de Serviço</h4>
            <p>Exportar todas as O.S. com status e totais</p>
            <button
              className="btn-primary"
              onClick={() => handleExport('workOrders')}
            >
              📥 Exportar O.S.
            </button>
          </div>

          <div className="export-card">
            <div className="export-icon">👥</div>
            <h4>Clientes</h4>
            <p>Lista completa de clientes cadastrados</p>
            <button
              className="btn-primary"
              onClick={() => handleExport('clients')}
            >
              📥 Exportar Clientes
            </button>
          </div>

          <div className="export-card">
            <div className="export-icon">💰</div>
            <h4>Lançamentos</h4>
            <p>Todos os lançamentos financeiros</p>
            <button
              className="btn-primary"
              onClick={() => handleExport('ledger')}
            >
              📥 Exportar Lançamentos
            </button>
          </div>
        </div>
      </section>

      {/* Relatório Financeiro */}
      <section className="reports-section">
        <h3>📈 Relatório Financeiro Mensal</h3>
        <div className="financial-report">
          <div className="report-filters">
            <div className="filter-group">
              <label>Mês:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="form-select"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Ano:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="form-select"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={() => handleExport('financial')}
            >
              📥 Exportar Relatório
            </button>
          </div>

          <div className="report-preview">
            <p className="report-info">
              Relatório de <strong>{months[selectedMonth - 1]} {selectedYear}</strong>
            </p>
            <p className="report-description">
              Inclui resumo de receitas, despesas, saldo e detalhamento completo de todos os lançamentos do período.
            </p>
          </div>
        </div>
      </section>

      {/* Dicas */}
      <section className="reports-section tips">
        <h3>💡 Dicas</h3>
        <ul className="tips-list">
          <li>
            <strong>Formato CSV:</strong> Os arquivos podem ser abertos no Excel, Google Sheets ou qualquer editor de planilhas.
          </li>
          <li>
            <strong>Backup Regular:</strong> Recomendamos exportar seus dados semanalmente para segurança.
          </li>
          <li>
            <strong>Análise de Dados:</strong> Use os relatórios CSV para criar gráficos e análises personalizadas.
          </li>
          <li>
            <strong>Compatibilidade:</strong> Os arquivos CSV usam codificação UTF-8 e são compatíveis com sistemas contábeis.
          </li>
        </ul>
      </section>
    </div>
  );
}
