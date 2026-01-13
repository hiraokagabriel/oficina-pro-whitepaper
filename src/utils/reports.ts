import { WorkOrder, LedgerEntry, Client } from '../types/index';
import { formatCurrency, formatDate } from './helpers';

// ============================================================================
// REPORT GENERATION
// ============================================================================

export interface MonthlyReport {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  completedOrders: number;
  totalOrderValue: number;
}

export function generateMonthlyReport(
  ledger: LedgerEntry[],
  workOrders: WorkOrder[],
  year: number,
  month: number
): MonthlyReport {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const monthlyLedger = ledger.filter((entry) => {
    const date = new Date(entry.date);
    return date >= monthStart && date <= monthEnd;
  });

  const monthlyOrders = workOrders.filter((order) => {
    const date = new Date(order.createdAt);
    return date >= monthStart && date <= monthEnd && order.status === 'FINALIZADO';
  });

  const totalIncome = monthlyLedger
    .filter((e) => e.type === 'RECEITA')
    .reduce((sum, e) => sum + e.value, 0);

  const totalExpense = monthlyLedger
    .filter((e) => e.type === 'DESPESA')
    .reduce((sum, e) => sum + e.value, 0);

  const totalOrderValue = monthlyOrders.reduce((sum, order) => sum + order.totalValue, 0);

  return {
    month,
    year,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    completedOrders: monthlyOrders.length,
    totalOrderValue,
  };
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export function exportToCSV(
  data: Record<string, any>[],
  filename: string = 'export.csv'
): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value || '';
        })
        .join(',')
    ),
  ].join('\n');

  downloadFile(csv, filename, 'text/csv');
}

export function exportToJSON(
  data: Record<string, any>,
  filename: string = 'export.json'
): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// ============================================================================
// PRINT UTILITIES
// ============================================================================

export function generatePrintHTML(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          background: white;
        }
        h1 { font-size: 24px; margin-bottom: 20px; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
          font-weight: 600;
        }
        .total { font-weight: bold; }
        @media print {
          body { margin: 0; padding: 0; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${content}
    </body>
    </html>
  `;
}

export function printWindow(html: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  }
}

// ============================================================================
// SUMMARY GENERATION
// ============================================================================

export interface ClientSummary {
  clientName: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export function generateClientSummaries(clients: Client[], workOrders: WorkOrder[]): ClientSummary[] {
  return clients.map((client) => {
    const clientOrders = workOrders.filter((wo) => wo.clientId === client.id);
    const totalSpent = clientOrders.reduce((sum, wo) => sum + wo.totalValue, 0);
    const lastOrder = clientOrders.length > 0
      ? clientOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : null;

    return {
      clientName: client.name,
      phone: client.phone,
      totalOrders: clientOrders.length,
      totalSpent,
      lastOrderDate: lastOrder ? formatDate(lastOrder.createdAt) : 'N/A',
    };
  });
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface FinancialMetrics {
  averageOrderValue: number;
  monthlyAverageIncome: number;
  monthlyAverageExpense: number;
  totalClients: number;
  totalCompletedOrders: number;
}

export function calculateFinancialMetrics(
  workOrders: WorkOrder[],
  ledger: LedgerEntry[],
  clients: Client[]
): FinancialMetrics {
  const completedOrders = workOrders.filter((wo) => wo.status === 'FINALIZADO');
  const averageOrderValue =
    completedOrders.length > 0
      ? completedOrders.reduce((sum, wo) => sum + wo.totalValue, 0) / completedOrders.length
      : 0;

  const totalIncome = ledger
    .filter((e) => e.type === 'RECEITA')
    .reduce((sum, e) => sum + e.value, 0);

  const totalExpense = ledger
    .filter((e) => e.type === 'DESPESA')
    .reduce((sum, e) => sum + e.value, 0);

  // Assume data spans 12 months for average
  const monthCount = 12;
  const monthlyAverageIncome = totalIncome / monthCount;
  const monthlyAverageExpense = totalExpense / monthCount;

  return {
    averageOrderValue,
    monthlyAverageIncome,
    monthlyAverageExpense,
    totalClients: clients.length,
    totalCompletedOrders: completedOrders.length,
  };
}
