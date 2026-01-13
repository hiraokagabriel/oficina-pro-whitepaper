import React, { useState, useMemo } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { LedgerModal } from './LedgerModal';
import { Table } from './Table';
import { formatCurrency, formatDate, calculateMonthlyBalance, calculateTotalBalance } from '../utils/helpers';
import '../styles/Dashboard.css';

export function FinancialDashboard() {
  const db = useDatabaseContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthlyBalance = useMemo(() => {
    return calculateMonthlyBalance(db.ledger, selectedYear, selectedMonth);
  }, [db.ledger, selectedYear, selectedMonth]);

  const totalBalance = useMemo(() => {
    return calculateTotalBalance(db.ledger);
  }, [db.ledger]);

  const monthlyLedger = useMemo(() => {
    return db.ledger.filter((entry) => {
      const date = new Date(entry.date);
      return (
        date.getFullYear() === selectedYear &&
        date.getMonth() === selectedMonth - 1
      );
    });
  }, [db.ledger, selectedYear, selectedMonth]);

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => selectedYear - 2 + i
  );

  return (
    <div className="financial-dashboard">
      <div className="dashboard-header">
        <h2>Gestão Financeira</h2>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Novo Lançamento
        </button>
      </div>

      {/* Seleção de Período */}
      <div className="period-selector">
        <select
          className="form-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          className="form-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Cards de Resumo */}
      <div className="dashboard-cards">
        <div className="card">
          <div className="card-label">Receita</div>
          <div className="card-value income">
            {formatCurrency(monthlyBalance.income)}
          </div>
          <div className="card-subtitle">{monthlyBalance.income > 0 ? '+' : ''}{monthlyBalance.income.toFixed(2)}</div>
        </div>

        <div className="card">
          <div className="card-label">Despesa</div>
          <div className="card-value expense">
            {formatCurrency(monthlyBalance.expense)}
          </div>
          <div className="card-subtitle">-{monthlyBalance.expense.toFixed(2)}</div>
        </div>

        <div className="card">
          <div className="card-label">Saldo do Mês</div>
          <div
            className={`card-value ${
              monthlyBalance.balance >= 0 ? 'positive' : 'negative'
            }`}
          >
            {formatCurrency(monthlyBalance.balance)}
          </div>
          <div className="card-subtitle">{monthlyBalance.balance > 0 ? '+' : ''}{monthlyBalance.balance.toFixed(2)}</div>
        </div>

        <div className="card">
          <div className="card-label">Saldo Total</div>
          <div className={`card-value ${ totalBalance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(totalBalance)}
          </div>
          <div className="card-subtitle">Acumulado</div>
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="section">
        <h3>Lançamentos do Mês</h3>
        <Table
          data={monthlyLedger}
          keyField="id"
          columns={[
            {
              key: 'date',
              label: 'Data',
              render: (value) => formatDate(value),
              width: '100px',
            },
            {
              key: 'type',
              label: 'Tipo',
              render: (value) => (
                <span
                  className={`badge ${
                    value === 'RECEITA' ? 'badge-success' : 'badge-danger'
                  }`}
                >
                  {value === 'RECEITA' ? 'Receita' : 'Despesa'}
                </span>
              ),
              width: '100px',
            },
            {
              key: 'description',
              label: 'Descrição',
            },
            {
              key: 'category',
              label: 'Categoria',
            },
            {
              key: 'value',
              label: 'Valor',
              render: (value, row) => (
                <span className={row.type === 'RECEITA' ? 'text-success' : 'text-danger'}>
                  {row.type === 'RECEITA' ? '+' : '-'} {formatCurrency(value)}
                </span>
              ),
              width: '120px',
            },
          ]}
          emptyMessage="Nenhum lançamento neste mês"
        />
      </div>

      <LedgerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
