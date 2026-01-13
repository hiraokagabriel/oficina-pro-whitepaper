import { v4 as uuidv4 } from 'uuid';
import {
  UUID,
  createUUID,
  WorkOrder,
  LedgerEntry,
  Client,
  ClientVehicle,
  WorkOrderItem,
  Service,
  Part,
  Settings,
  Database,
} from '../types/index';

// ============================================================================
// ID GENERATION
// ============================================================================

export function generateUUID(): UUID {
  return createUUID(uuidv4());
}

// ============================================================================
// CREATION HELPERS
// ============================================================================

export function createEmptyWorkOrder(clientId: UUID): WorkOrder {
  return {
    id: generateUUID(),
    clientId,
    vehicleDescription: '',
    status: 'ORCAMENTO',
    items: [],
    totalValue: 0,
    publicNotes: '',
    internalNotes: '',
    createdAt: new Date().toISOString(),
    isReconciled: false,
  };
}

export function createEmptyClient(): Client {
  return {
    id: generateUUID(),
    name: '',
    phone: '',
    vehicles: [],
    totalOrders: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
  };
}

export function createEmptyLedgerEntry(): LedgerEntry {
  return {
    id: generateUUID(),
    type: 'RECEITA',
    description: '',
    value: 0,
    date: new Date().toISOString().split('T')[0],
    installmentInfo: {
      totalInstallments: 1,
      currentInstallment: 1,
    },
  };
}

export function createEmptyWorkOrderItem(): WorkOrderItem {
  return {
    id: uuidv4(),
    type: 'SERVICO',
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0,
  };
}

export function createDefaultSettings(): Settings {
  return {
    officeName: 'Oficina Pro',
    officeCNPJ: '',
    officePhone: '',
    officeAddress: '',
    theme: 'dark',
    language: 'pt-BR',
    autoBackupEnabled: true,
    autoBackupInterval: 'daily',
    currency: 'BRL',
    decimalSeparator: ',',
  };
}

export function createEmptyDatabase(): Database {
  return {
    version: '1.0',
    lastModified: new Date().toISOString(),
    workOrders: [],
    ledger: [],
    clients: [],
    services: [],
    parts: [],
    settings: createDefaultSettings(),
  };
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

export function formatCurrency(
  value: number,
  decimalSeparator: ',' | '.' = ','
): string {
  const parts = value.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${integerPart}${decimalSeparator}${parts[1]}`;
}

export function parseCurrency(value: string): number {
  const cleaned = value
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  return parseFloat(cleaned);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

export function formatDateTimeLocal(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/` +
      `${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }
  return cnpj;
}

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

export function calculateWorkOrderTotal(items: WorkOrderItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

export function calculateMonthlyBalance(
  ledger: LedgerEntry[],
  year: number,
  month: number
): { income: number; expense: number; balance: number } {
  const filtered = ledger.filter((entry) => {
    const date = new Date(entry.date);
    return date.getFullYear() === year && date.getMonth() === month - 1;
  });

  const income = filtered
    .filter((e) => e.type === 'RECEITA')
    .reduce((sum, e) => sum + e.value, 0);

  const expense = filtered
    .filter((e) => e.type === 'DESPESA')
    .reduce((sum, e) => sum + e.value, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
}

export function calculateTotalBalance(ledger: LedgerEntry[]): number {
  return ledger.reduce(
    (sum, entry) => (entry.type === 'RECEITA' ? sum + entry.value : sum - entry.value),
    0
  );
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.length === 14;
}

export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
}

// ============================================================================
// SEARCH/FILTER HELPERS
// ============================================================================

export function searchClients(clients: Client[], query: string): Client[] {
  const lowerQuery = query.toLowerCase().trim();
  return clients.filter(
    (client) =>
      client.name.toLowerCase().includes(lowerQuery) ||
      client.phone.includes(lowerQuery)
  );
}

export function searchServices(services: Service[], query: string): Service[] {
  const lowerQuery = query.toLowerCase().trim();
  return services.filter(
    (service) =>
      service.name.toLowerCase().includes(lowerQuery) &&
      service.isActive
  );
}

export function searchParts(parts: Part[], query: string): Part[] {
  const lowerQuery = query.toLowerCase().trim();
  return parts.filter(
    (part) =>
      (part.name.toLowerCase().includes(lowerQuery) ||
        part.partNumber?.toLowerCase().includes(lowerQuery)) &&
      part.isActive
  );
}

// ============================================================================
// SORTING HELPERS
// ============================================================================

export function sortByDate<T extends { createdAt: string }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
}

export function sortByName<T extends { name: string }>(
  items: T[],
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name, 'pt-BR');
    return order === 'desc' ? -comparison : comparison;
  });
}

// ============================================================================
// MISC HELPERS
// ============================================================================

export function getMonthName(month: number): string {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return monthNames[month - 1] || '';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'ORCAMENTO': '#8257e6',
    'APROVADO': '#00bcd4',
    'EM_SERVICO': '#f97316',
    'FINALIZADO': '#22c55e',
    'ARQUIVADO': '#a9a9b2',
  };
  return colors[status] || '#666';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'ORCAMENTO': 'Orçamento',
    'APROVADO': 'Aprovado',
    'EM_SERVICO': 'Em Serviço',
    'FINALIZADO': 'Finalizado',
    'ARQUIVADO': 'Arquivado',
  };
  return labels[status] || status;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
