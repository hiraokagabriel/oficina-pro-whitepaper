import { WorkOrder, LedgerEntry, Client, Service, Part } from '../types/index';

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// WORK ORDER VALIDATORS
// ============================================================================

export function validateWorkOrder(order: WorkOrder): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!order.clientId) {
    errors.push({ field: 'clientId', message: 'Cliente é obrigatório' });
  }

  if (!order.vehicleDescription.trim()) {
    errors.push({
      field: 'vehicleDescription',
      message: 'Descrição do veículo é obrigatória',
    });
  }

  if (order.items.length === 0) {
    errors.push({
      field: 'items',
      message: 'Adicione pelo menos um item (peça ou serviço)',
    });
  }

  const calculatedTotal = order.items.reduce((sum, item) => sum + item.total, 0);
  if (Math.abs(order.totalValue - calculatedTotal) > 0.01) {
    errors.push({
      field: 'totalValue',
      message: 'Total não corresponde aos itens',
    });
  }

  // Validate items
  order.items.forEach((item, index) => {
    if (!item.description.trim()) {
      errors.push({
        field: `items[${index}].description`,
        message: 'Descrição do item é obrigatória',
      });
    }
    if (item.quantity <= 0) {
      errors.push({
        field: `items[${index}].quantity`,
        message: 'Quantidade deve ser maior que 0',
      });
    }
    if (item.unitPrice < 0) {
      errors.push({
        field: `items[${index}].unitPrice`,
        message: 'Preço não pode ser negativo',
      });
    }
  });

  return errors;
}

// ============================================================================
// LEDGER ENTRY VALIDATORS
// ============================================================================

export function validateLedgerEntry(entry: LedgerEntry): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!entry.description.trim()) {
    errors.push({
      field: 'description',
      message: 'Descrição é obrigatória',
    });
  }

  if (entry.value <= 0) {
    errors.push({
      field: 'value',
      message: 'Valor deve ser maior que 0',
    });
  }

  if (!entry.date) {
    errors.push({
      field: 'date',
      message: 'Data é obrigatória',
    });
  } else {
    const date = new Date(entry.date);
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'date',
        message: 'Data inválida',
      });
    }
  }

  if (entry.installmentInfo) {
    if (entry.installmentInfo.totalInstallments <= 0) {
      errors.push({
        field: 'installmentInfo.totalInstallments',
        message: 'Número de parcelas deve ser maior que 0',
      });
    }
    if (
      entry.installmentInfo.currentInstallment <= 0 ||
      entry.installmentInfo.currentInstallment > entry.installmentInfo.totalInstallments
    ) {
      errors.push({
        field: 'installmentInfo.currentInstallment',
        message: 'Parcela atual inválida',
      });
    }
  }

  return errors;
}

// ============================================================================
// CLIENT VALIDATORS
// ============================================================================

export function validateClient(client: Client): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!client.name.trim()) {
    errors.push({
      field: 'name',
      message: 'Nome do cliente é obrigatório',
    });
  }

  if (!client.phone.trim()) {
    errors.push({
      field: 'phone',
      message: 'Telefone é obrigatório',
    });
  } else if (!isValidPhone(client.phone)) {
    errors.push({
      field: 'phone',
      message: 'Telefone inválido (deve ter 10 ou 11 dígitos)',
    });
  }

  if (client.email && !isValidEmail(client.email)) {
    errors.push({
      field: 'email',
      message: 'Email inválido',
    });
  }

  if (client.cpf && !isValidCPF(client.cpf)) {
    errors.push({
      field: 'cpf',
      message: 'CPF inválido',
    });
  }

  return errors;
}

// ============================================================================
// SERVICE VALIDATORS
// ============================================================================

export function validateService(service: Service): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!service.name.trim()) {
    errors.push({
      field: 'name',
      message: 'Nome do serviço é obrigatório',
    });
  }

  if (service.basePrice < 0) {
    errors.push({
      field: 'basePrice',
      message: 'Preço não pode ser negativo',
    });
  }

  return errors;
}

// ============================================================================
// PART VALIDATORS
// ============================================================================

export function validatePart(part: Part): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!part.name.trim()) {
    errors.push({
      field: 'name',
      message: 'Nome da peça é obrigatório',
    });
  }

  if (!part.category.trim()) {
    errors.push({
      field: 'category',
      message: 'Categoria é obrigatória',
    });
  }

  if (part.quantity < 0) {
    errors.push({
      field: 'quantity',
      message: 'Quantidade não pode ser negativa',
    });
  }

  if (part.basePrice < 0) {
    errors.push({
      field: 'basePrice',
      message: 'Preço não pode ser negativo',
    });
  }

  return errors;
}

// ============================================================================
// UTIL VALIDATORS
// ============================================================================

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;

  // Check for repeated digits
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) return false;

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned[10])) return false;

  return true;
}

export function isHasValidationErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

export function getFirstValidationError(errors: ValidationError[]): string | null {
  return errors.length > 0 ? errors[0].message : null;
}
