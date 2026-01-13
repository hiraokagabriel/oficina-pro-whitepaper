// UUID branded type for type safety
export type UUID = string & { readonly __brand: 'UUID' };

// Helper to create UUIDs with type safety
export function createUUID(id: string): UUID {
  return id as UUID;
}

// ============================================================================
// WORK ORDER TYPES
// ============================================================================

export type WorkOrderStatus =
  | 'ORCAMENTO'
  | 'APROVADO'
  | 'EM_SERVICO'
  | 'FINALIZADO'
  | 'ARQUIVADO';

export interface WorkOrderItem {
  id: string; // uuid
  type: 'SERVICO' | 'PECA';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number; // quantity * unitPrice (cache)
}

export interface WorkOrder {
  id: UUID;
  clientId: UUID;
  vehicleDescription: string;
  status: WorkOrderStatus;
  items: WorkOrderItem[];
  totalValue: number; // sum of items.total
  publicNotes: string; // visible on print
  internalNotes: string; // internal only
  createdAt: string; // ISO8601
  approvedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  isReconciled: boolean;
}

// ============================================================================
// FINANCIAL TYPES
// ============================================================================

export interface InstallmentInfo {
  totalInstallments: number;
  currentInstallment: number;
  recurrence?: 'MONTHLY' | 'WEEKLY';
}

export interface LedgerEntry {
  id: UUID;
  type: 'RECEITA' | 'DESPESA';
  description: string;
  value: number; // always positive, type determines direction
  date: string; // YYYY-MM-DD
  category?: string;
  workOrderId?: UUID; // link to WorkOrder if applicable
  installmentInfo?: InstallmentInfo;
  metadata?: {
    paymentMethod?: 'DINHEIRO' | 'CARTAO' | 'PIX' | 'CHEQUE';
    isPaid?: boolean;
  };
}

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface ClientVehicle {
  id: string; // uuid
  description: string; // "Fiat Uno 2010 prata"
  plate?: string; // "ABC1234"
  lastServiceAt?: string; // ISO8601
}

export interface Client {
  id: UUID;
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
  vehicles: ClientVehicle[];
  totalOrders: number; // cache
  totalSpent: number; // cache
  createdAt: string; // ISO8601
  lastServiceAt?: string;
  notes?: string;
}

// ============================================================================
// CATALOG TYPES
// ============================================================================

export interface Service {
  id: UUID;
  name: string;
  description?: string;
  basePrice: number;
  estimatedTime?: number; // in minutes
  category?: string; // "Manutenção", "Reparo"
  isActive: boolean;
  usageCount: number; // auto-learning
  lastUsedAt?: string;
}

export interface Part {
  id: UUID;
  name: string;
  description?: string;
  category: string; // "Filtros", "Fluidos"
  partNumber?: string; // supplier code
  quantity: number; // stock quantity
  minQuantity: number; // alert level
  basePrice: number; // selling price
  costPrice?: number; // cost price for reports
  usageCount: number; // auto-learning
  lastUsedAt?: string;
  isActive: boolean;
}

// ============================================================================
// SETTINGS TYPES
// ============================================================================

export interface Settings {
  officeName: string;
  officeCNPJ: string;
  officePhone: string;
  officeAddress: string;
  theme: 'dark' | 'pastel';
  language: 'pt-BR' | 'en-US';
  lastBackupAt?: string;
  autoBackupEnabled: boolean;
  autoBackupInterval: 'daily' | 'weekly';
  logoUrl?: string;
  footerText?: string;
  currency: 'BRL' | 'USD';
  decimalSeparator: ',' | '.';
}

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface Database {
  version: string;
  lastModified: string; // ISO8601
  workOrders: WorkOrder[];
  ledger: LedgerEntry[];
  clients: Client[];
  services: Service[];
  parts: Part[];
  settings: Settings;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export type ActiveTab = 'workshop' | 'financial' | 'crm' | 'config';

export interface UIState {
  activeTab: ActiveTab;
  isLoading: boolean;
  lastError?: Error;
  isSyncing: boolean;
}

export interface ModalState {
  osModal: {
    isOpen: boolean;
    editingId?: UUID;
  };
  entryModal: {
    isOpen: boolean;
    editingId?: UUID;
  };
  confirmationModal: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  };
  [key: string]: any;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BackupResult {
  file_id: string;
  url: string;
  timestamp: string;
}
