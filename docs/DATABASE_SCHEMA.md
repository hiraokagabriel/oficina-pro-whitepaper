# 🗣️ Esquema do Banco de Dados - ERP Oficina PRO

## Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura Principal](#estrutura-principal)
3. [Tipos de Dados](#tipos-de-dados)
4. [Exemplos de Dados](#exemplos-de-dados)
5. [Integridade de Dados](#integridade-de-dados)
6. [Migrações Futuras](#migrações-futuras)

---

## Visão Geral

```
database.json (Local, ~500KB-2MB)
├─ workOrders[]          # Ordens de Serviço
├─ ledger[]              # Lançamentos Financeiros
├─ clients[]             # Base de Clientes
├─ services[]            # Catálogo de Serviços
├─ parts[]               # Estoque de Peças
└─ settings              # Configurações da Oficina
```

### Características

- **Formato:** JSON válido
- **Encoding:** UTF-8
- **Tamanho Máximo:** ~2MB (limite prático)
- **Persistência:** Atomémica (Rust garante)
- **Backup:** Manual (Google Drive) ou CSV export

---

## Estrutura Principal

### Root Schema

```typescript
interface Database {
  version: "1.0";                      // Versão do schema
  lastModified: ISO8601;                // Data da última mudança
  workOrders: WorkOrder[];
  ledger: LedgerEntry[];
  clients: Client[];
  services: Service[];
  parts: Part[];
  settings: Settings;
}
```

---

## Tipos de Dados

### 1. WorkOrder (Ordem de Serviço)

```typescript
interface WorkOrder {
  id: string;                           // UUID
  clientId: string;                     // Foreign key -> clients[]
  vehicleDescription: string;           // Ex: "Fiat Uno 2010 prata"
  
  status: WorkOrderStatus;
  // = "ORCAMENTO" | "APROVADO" | "EM_SERVICO" | "FINALIZADO" | "ARQUIVADO"
  
  items: WorkOrderItem[];               // Lista de serviços e peças
  totalValue: number;                   // Calculado: sum(items)
  
  publicNotes: string;                  // Visível ao cliente (impressão)
  internalNotes: string;                // Uso interno apenas
  
  createdAt: ISO8601;
  approvedAt?: ISO8601;                 // Quando virou APROVADO
  startedAt?: ISO8601;                  // Quando virou EM_SERVICO
  finishedAt?: ISO8601;                 // Quando virou FINALIZADO
  
  isReconciled: boolean;                // Se foi lançada no financeiro
}

interface WorkOrderItem {
  id: string;                           // UUID (para editação)
  type: "SERVICO" | "PECA";             // Diferencia serviço de peça
  description: string;                  // "Troca de Óleo", "Filtro Bosch"
  
  quantity: number;                     // Quantidade
  unitPrice: number;                    // Preço unitário
  total: number;                        // quantity * unitPrice (cache)
}
```

**Exemplo Completo:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "clientId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "vehicleDescription": "Fiat Uno 2010 prata (placa ABC1234)",
  "status": "EM_SERVICO",
  "items": [
    {
      "id": "item-1",
      "type": "SERVICO",
      "description": "Troca de óleo com filtro",
      "quantity": 1,
      "unitPrice": 150.00,
      "total": 150.00
    },
    {
      "id": "item-2",
      "type": "PECA",
      "description": "Filtro de ar (Bosch K&N)",
      "quantity": 1,
      "unitPrice": 85.00,
      "total": 85.00
    }
  ],
  "totalValue": 235.00,
  "publicNotes": "Troca de óleo com filtro de ar. Veífculo com pequeno vazamento de óleo no motor - investigar.",
  "internalNotes": "João avisa que o carro tem barulho estranho no motor, pode ser corrente.",
  "createdAt": "2026-01-13T09:30:00Z",
  "approvedAt": "2026-01-13T10:15:00Z",
  "startedAt": "2026-01-13T11:00:00Z",
  "finishedAt": null,
  "isReconciled": false
}
```

---

### 2. LedgerEntry (Lançamento Financeiro)

```typescript
interface LedgerEntry {
  id: string;                           // UUID
  type: "RECEITA" | "DESPESA";
  description: string;                  // "Receita OS #001", "Combustivel", etc
  value: number;                        // Valor (sempre positivo, tipo determina direção)
  date: Date;                           // Data contabil (YYYY-MM-DD)
  
  category?: string;                    // "Receita", "Combustível", "Aluguel"
  workOrderId?: string;                 // FK -> WorkOrder se for receita de OS
  
  installmentInfo?: {
    totalInstallments: number;          // Quantas parcelas
    currentInstallment: number;         // Qual é esta (1/3, 2/3, 3/3)
    recurrence?: "MONTHLY" | "WEEKLY";  // Para lançamentos repetidos
  };
  
  metadata?: {
    paymentMethod?: "DINHEIRO" | "CARTAO" | "PIX" | "CHEQUE";
    isPaid?: boolean;
  };
}
```

**Exemplos:**

```json
[
  {
    "id": "entry-001",
    "type": "RECEITA",
    "description": "Receita Ordem de Serviço #001",
    "value": 235.00,
    "date": "2026-01-13",
    "category": "Receita",
    "workOrderId": "550e8400-e29b-41d4-a716-446655440000",
    "installmentInfo": {
      "totalInstallments": 1,
      "currentInstallment": 1
    },
    "metadata": {
      "paymentMethod": "PIX",
      "isPaid": true
    }
  },
  {
    "id": "entry-002",
    "type": "DESPESA",
    "description": "Combustivel do mês",
    "value": 450.00,
    "date": "2026-01-10",
    "category": "Combustível",
    "installmentInfo": {
      "totalInstallments": 1,
      "currentInstallment": 1
    }
  },
  {
    "id": "entry-003",
    "type": "DESPESA",
    "description": "Aluguel do galpão",
    "value": 2000.00,
    "date": "2026-02-01",
    "category": "Aluguel",
    "installmentInfo": {
      "totalInstallments": 1,
      "currentInstallment": 1,
      "recurrence": "MONTHLY"
    }
  },
  {
    "id": "entry-004",
    "type": "DESPESA",
    "description": "Compressor de ar 3x",
    "value": 400.00,
    "date": "2026-01-15",
    "category": "Ferramentas",
    "installmentInfo": {
      "totalInstallments": 3,
      "currentInstallment": 1
    }
  }
]
```

---

### 3. Client (Cliente)

```typescript
interface Client {
  id: string;                           // UUID
  name: string;                         // "João Silva"
  phone: string;                        // "(11) 98765-4321"
  email?: string;
  cpf?: string;                         // Opcional, para futura nota fiscal
  
  vehicles: ClientVehicle[];            // Histórico de veículos
  
  totalOrders: number;                  // Cache: quantas OS já fez
  totalSpent: number;                   // Cache: quanto gastou
  
  createdAt: ISO8601;
  lastServiceAt?: ISO8601;              // Última OS
  notes?: string;                       // Observações gerais
}

interface ClientVehicle {
  id: string;                           // UUID
  description: string;                  // "Fiat Uno 2010 prata"
  plate?: string;                       // "ABC1234" (opcional)
  lastServiceAt?: ISO8601;
}
```

**Exemplo:**
```json
{
  "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "name": "João da Silva",
  "phone": "(11) 98765-4321",
  "email": "joao@example.com",
  "cpf": "123.456.789-00",
  "vehicles": [
    {
      "id": "vehicle-1",
      "description": "Fiat Uno 2010 prata",
      "plate": "ABC1234",
      "lastServiceAt": "2026-01-13T11:00:00Z"
    },
    {
      "id": "vehicle-2",
      "description": "Honda Civic 2015 branco",
      "plate": null,
      "lastServiceAt": "2025-12-01T14:30:00Z"
    }
  ],
  "totalOrders": 12,
  "totalSpent": 3500.00,
  "createdAt": "2024-06-15T10:00:00Z",
  "lastServiceAt": "2026-01-13T11:00:00Z",
  "notes": "Cliente muito pontual nos pagamentos, pode dar desconto"
}
```

---

### 4. Service (Serviço do Catálogo)

```typescript
interface Service {
  id: string;                           // UUID
  name: string;                         // "Troca de óleo"
  description?: string;
  basePrice: number;                    // Preço base
  estimatedTime?: number;               // Em minutos
  category?: string;                    // "Manutenção", "Reparo"
  isActive: boolean;                    // Para desativar sem deletar
  
  usageCount: number;                   // Auto-aprendizado
  lastUsedAt?: ISO8601;
}
```

---

### 5. Part (Peça do Estoque)

```typescript
interface Part {
  id: string;                           // UUID
  name: string;                         // "Filtro de ar Bosch K&N"
  description?: string;
  
  category: string;                     // "Filtros", "Fluidos", "Acessórios"
  partNumber?: string;                  // "KN-123-ABC" (código fornecedor)
  
  quantity: number;                     // Quantidade em estoque
  minQuantity: number;                  // Nível de alerta
  
  basePrice: number;                    // Preço de venda
  costPrice?: number;                   // Preço de custo (para relatórios)
  
  usageCount: number;                   // Auto-aprendizado
  lastUsedAt?: ISO8601;
  isActive: boolean;
}
```

---

### 6. Settings (Configurações da Oficina)

```typescript
interface Settings {
  // Dados da Oficina
  officeName: string;                   // "Oficina do João"
  officeCNPJ: string;                   // "XX.XXX.XXX/0001-XX"
  officePhone: string;                  // "(11) 3456-7890"
  officeAddress: string;                // "Rua X, n° 123"
  
  // UI Preferences
  theme: "dark" | "pastel";
  language: "pt-BR" | "en-US";          // Para futuro i18n
  
  // Configurações de Backup
  lastBackupAt?: ISO8601;
  autoBackupEnabled: boolean;
  autoBackupInterval: "daily" | "weekly";
  
  // Figuras dos relatórios
  logoUrl?: string;                     // Caminho local
  footerText?: string;
  
  // Currency
  currency: "BRL" | "USD";              // Para futuro multi-moeda
  decimalSeparator: "," | ".";
}
```

---

## Exemplos de Dados

### Arquivo database.json Completo (Mínimo)

```json
{
  "version": "1.0",
  "lastModified": "2026-01-13T12:30:00Z",
  
  "workOrders": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "clientId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "vehicleDescription": "Fiat Uno 2010 prata",
      "status": "FINALIZADO",
      "items": [
        {
          "id": "item-1",
          "type": "SERVICO",
          "description": "Troca de óleo",
          "quantity": 1,
          "unitPrice": 150,
          "total": 150
        }
      ],
      "totalValue": 150,
      "publicNotes": "",
      "internalNotes": "",
      "createdAt": "2026-01-13T09:30:00Z",
      "approvedAt": "2026-01-13T10:00:00Z",
      "startedAt": "2026-01-13T10:30:00Z",
      "finishedAt": "2026-01-13T11:00:00Z",
      "isReconciled": false
    }
  ],
  
  "ledger": [
    {
      "id": "entry-001",
      "type": "RECEITA",
      "description": "Receita Ordem de Serviço",
      "value": 150,
      "date": "2026-01-13",
      "category": "Receita",
      "installmentInfo": {
        "totalInstallments": 1,
        "currentInstallment": 1
      }
    }
  ],
  
  "clients": [
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "name": "João da Silva",
      "phone": "(11) 98765-4321",
      "vehicles": [
        {
          "id": "vehicle-1",
          "description": "Fiat Uno 2010 prata",
          "plate": "ABC1234"
        }
      ],
      "totalOrders": 1,
      "totalSpent": 150,
      "createdAt": "2026-01-13T09:30:00Z"
    }
  ],
  
  "services": [
    {
      "id": "service-1",
      "name": "Troca de óleo",
      "basePrice": 150,
      "category": "Manutenção",
      "isActive": true,
      "usageCount": 1
    }
  ],
  
  "parts": [],
  
  "settings": {
    "officeName": "Oficina Pro",
    "officeCNPJ": "12.345.678/0001-90",
    "officePhone": "(11) 3456-7890",
    "officeAddress": "Rua X, 123",
    "theme": "dark",
    "language": "pt-BR",
    "autoBackupEnabled": true,
    "autoBackupInterval": "daily",
    "currency": "BRL",
    "decimalSeparator": ","
  }
}
```

---

## Integridade de Dados

### Validações Implementadas

```typescript
// TypeScript compile-time
✅ Tipos estritos para todos os campos
✅ UUIDs válidos
✅ Datas em ISO8601
✅ Enums para status

// Runtime validators (validators.ts)
✅ WorkOrder.totalValue = sum(items)
✅ LedgerEntry.value > 0
✅ Client.phone match /\(\d{2}\) \d{4,5}-\d{4}/
✅ CNPJ format validation

// Cascade integrity
✅ Editar cliente → atualiza todas suas OS
✅ Deletar cliente → oferece opção de arquivar tudo
✅ Deletar OS → pergunta se quer deletar receita associada
```

### Exemplo de Validação

```typescript
// validators.ts
export function validateWorkOrder(order: WorkOrder): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!order.clientId) {
    errors.push({ field: 'clientId', message: 'Cliente é obrigatório' });
  }
  
  if (order.items.length === 0) {
    errors.push({ field: 'items', message: 'Adicione pelo menos um item' });
  }
  
  const calculatedTotal = order.items.reduce((sum, item) => sum + item.total, 0);
  if (order.totalValue !== calculatedTotal) {
    errors.push({ field: 'totalValue', message: 'Total não corresponde aos itens' });
  }
  
  return errors;
}
```

---

## Migrações Futuras

### Phase 2: SQLite Local

```sql
CRIATE TABLE work_orders (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  vehicle_description TEXT,
  status TEXT CHECK(status IN ('ORCAMENTO', 'APROVADO', 'EM_SERVICO', 'FINALIZADO', 'ARQUIVADO')),
  total_value DECIMAL(10, 2),
  public_notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP,
  finished_at TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE ledger_entries (
  id TEXT PRIMARY KEY,
  type TEXT CHECK(type IN ('RECEITA', 'DESPESA')),
  description TEXT,
  value DECIMAL(10, 2),
  date DATE,
  category TEXT,
  work_order_id TEXT,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
);
```

**Vantagens:**
- Query mais rápido
- Indexação
- Melhor performance com 100k+ registros

### Phase 3: PostgreSQL Server-Side

```
Cliente (SQLite)  →  Sync API  →  Servidor (PostgreSQL)
  Local DB                        Remote DB
  
  Offline mode    →  Conflito?  →  Resolution strategy
  Mudou localmente    (Last-write-wins ou Custom)
  Mudou no servidor
```

---

**Próxima leitura:** [API_TAURI.md](./API_TAURI.md)
