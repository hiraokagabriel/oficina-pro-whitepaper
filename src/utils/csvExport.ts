import { WorkOrder, Client, LedgerEntry } from '../types/index';
import { formatCurrency, formatDate } from './helpers';

/**
 * Convert data to CSV format
 */
function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(',');
  const dataRows = data.map((row) =>
    headers.map((header) => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    }).join(',')
  );
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 */
function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Work Orders to CSV
 */
export function exportWorkOrdersToCSV(
  workOrders: WorkOrder[],
  clients: Client[]
) {
  const data = workOrders.map((wo) => {
    const client = clients.find((c) => c.id === wo.clientId);
    return {
      ID: wo.id.substring(0, 8),
      Cliente: client?.name || 'N/A',
      Veículo: wo.vehicleDescription,
      Status: wo.status,
      'Data Criação': formatDate(wo.createdAt),
      'Data Atualização': formatDate(wo.updatedAt),
      Total: formatCurrency(wo.total),
      'Notas Públicas': wo.publicNotes || '',
    };
  });

  const headers = [
    'ID',
    'Cliente',
    'Veículo',
    'Status',
    'Data Criação',
    'Data Atualização',
    'Total',
    'Notas Públicas',
  ];

  const csv = convertToCSV(data, headers);
  const filename = `ordens-servico-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export Clients to CSV
 */
export function exportClientsToCSV(clients: Client[]) {
  const data = clients.map((client) => ({
    ID: client.id.substring(0, 8),
    Nome: client.name,
    Telefone: client.phone,
    Email: client.email || '',
    CPF: client.cpf || '',
    Notas: client.notes || '',
  }));

  const headers = ['ID', 'Nome', 'Telefone', 'Email', 'CPF', 'Notas'];

  const csv = convertToCSV(data, headers);
  const filename = `clientes-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export Ledger entries to CSV
 */
export function exportLedgerToCSV(ledger: LedgerEntry[]) {
  const data = ledger.map((entry) => ({
    ID: entry.id.substring(0, 8),
    Tipo: entry.type === 'income' ? 'Receita' : 'Despesa',
    Descrição: entry.description,
    Valor: formatCurrency(entry.amount),
    Data: formatDate(entry.date),
    Categoria: entry.category || '',
    'ID O.S.': entry.workOrderId?.substring(0, 8) || '',
  }));

  const headers = [
    'ID',
    'Tipo',
    'Descrição',
    'Valor',
    'Data',
    'Categoria',
    'ID O.S.',
  ];

  const csv = convertToCSV(data, headers);
  const filename = `lancamentos-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export Financial Report (Monthly Summary)
 */
export function exportFinancialReportCSV(
  ledger: LedgerEntry[],
  month: number,
  year: number
) {
  const filteredEntries = ledger.filter((entry) => {
    const date = new Date(entry.date);
    return date.getMonth() === month - 1 && date.getFullYear() === year;
  });

  const income = filteredEntries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const expenses = filteredEntries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = income - expenses;

  const summary = [
    { Descrição: 'Total de Receitas', Valor: formatCurrency(income) },
    { Descrição: 'Total de Despesas', Valor: formatCurrency(expenses) },
    { Descrição: 'Saldo do Mês', Valor: formatCurrency(balance) },
    { Descrição: '', Valor: '' },
    { Descrição: 'DETALHAMENTO', Valor: '' },
  ];

  const details = filteredEntries.map((entry) => ({
    Descrição: entry.description,
    Valor:
      entry.type === 'income'
        ? formatCurrency(entry.amount)
        : `-${formatCurrency(entry.amount)}`,
    Data: formatDate(entry.date),
    Tipo: entry.type === 'income' ? 'Receita' : 'Despesa',
  }));

  const allData = [...summary, ...details];
  const headers = Object.keys(allData[0]);

  const csv = convertToCSV(allData, headers);
  const filename = `relatorio-financeiro-${year}-${String(month).padStart(2, '0')}.csv`;
  downloadCSV(csv, filename);
}
