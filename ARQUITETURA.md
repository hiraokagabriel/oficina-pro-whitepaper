# Arquitetura do Oficina PRO

## Visão Geral

O Oficina PRO é um ERP desktop para oficinas mecânicas, construído com React + TypeScript (frontend) e Tauri + Rust (backend). A arquitetura segue um padrão **local-first** com opção de sincronização em nuvem.

## Stack Tecnológico

### Frontend
```
React 18 + TypeScript
  └─ Vite (bundler)
      └─ CSS Modules + Variables
      └─ Context API (state management)
      └─ @hello-pangea/dnd (drag & drop)
      └─ Recharts (gráficos)
```

### Backend
```
Tauri
  └─ Rust
      └─ SQLite (database)
      └─ Serde (serialization)
```

## Estrutura de Diretórios

```
officina-erp/
├── src/
│   ├── components/
│   │   ├── KanbanBoard.tsx        # Visão Kanban das O.S.
│   │   ├── modals/               # Componentes de modais
│   │   ├── forms/                # Componentes de formulário
│   │   └── layout/               # Componentes de layout
│   ├── context/
│   │   └── DatabaseContext.tsx   # State management global
│   ├── styles/
│   │   ├── globals.css          # Estilos globais
│   │   ├── App.css              # Estilos do layout
│   │   └── *.css                 # Estilos componentes
│   ├── types/
│   │   └── index.ts            # Type definitions
│   ├── utils/
│   │   ├── helpers.ts          # Funções auxiliares
│   │   ├── validators.ts       # Validadores
│   │   └── format.ts           # Formatação de dados
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Fluxo de Dados

### Criação de Uma Ordem de Serviço

```
1. User
   └─ Click "+ Nova O.S."
       └─ Abre Modal
           └─ Validação em tempo real
               └─ Submit
                   └─ DatabaseContext.addWorkOrder()
                       └─ setState()
                           └─ Tauri invoke(save_database)
                               └─ SQLite persist
                                   └─ Auto-backup
```

### Sincronização de Dados

```
DatabaseContext
  └─ auto-save (debounced 1s)
      └─ saveDatabase()
          └─ invoke('save_database')
              └┠ SQLite (local)
              └┠ Cloud (opcional)
```

## Tipos de Dados Principais

### WorkOrder (Ordem de Serviço)
```typescript
interface WorkOrder {
  id: UUID;                    // ID único
  clientId: UUID;              // Referência ao cliente
  vehicleDescription: string;  // "Fiat Uno 2010 prata"
  status: WorkOrderStatus;     // ORCAMENTO | APROVADO | EM_SERVICO | ...
  items: WorkOrderItem[];      // Serviços + Peças
  totalValue: number;          // Soma dos items
  publicNotes: string;         // Visível na impressão
  internalNotes: string;       // Apenas interno
  createdAt: string;           // ISO8601
  approvedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  isReconciled: boolean;       // Reconciliado com financeiro
}
```

### Client (Cliente)
```typescript
interface Client {
  id: UUID;
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
  vehicles: ClientVehicle[]; // Veículos cadastrados
  totalOrders: number;        // Cache
  totalSpent: number;         // Cache
  createdAt: string;
  lastServiceAt?: string;
  notes?: string;
}
```

### LedgerEntry (Lançamento Financeiro)
```typescript
interface LedgerEntry {
  id: UUID;
  type: 'RECEITA' | 'DESPESA';
  description: string;
  value: number;                      // Sempre positivo
  date: string;                       // YYYY-MM-DD
  category?: string;
  workOrderId?: UUID;                 // Link com O.S.
  installmentInfo?: InstallmentInfo;  // Parcelamento
  metadata?: {
    paymentMethod: 'DINHEIRO' | 'CARTAO' | 'PIX' | 'CHEQUE';
    isPaid: boolean;
  };
}
```

## Fluxo de Estado

### DatabaseContext

```typescript
// Hook principal
const db = useDatabaseContext();

// Dados
db.workOrders        // Array de O.S.
db.clients           // Array de clientes
db.ledger            // Lançamentos financeiros
db.services          // Catálogo de serviços
db.parts             // Catálogo de peças
db.settings          // Configurações da oficina

// Métodos
db.addWorkOrder(order)
db.updateWorkOrder(id, updates)
db.deleteWorkOrder(id)
db.getWorkOrder(id)

db.addClient(client)
db.updateClient(id, updates)
db.deleteClient(id)
db.getClient(id)

// Status
db.isLoading         // Carregando dados iniciais
db.isSyncing         // Salvando no banco
db.lastError         // Último erro
db.lastSyncTime      // Última sincronização
```

## Validação de Dados

Todas as entidades possuem validadores em `src/utils/validators.ts`:

```typescript
// Exemplo
const errors = validateWorkOrder(order);
if (isHasValidationErrors(errors)) {
  const firstError = getFirstValidationError(errors);
  showError(firstError);
} else {
  db.addWorkOrder(order);
}
```

## Convenções de Código

### Tipos
- Use branded types para IDs: `type UUID = string & { readonly __brand: 'UUID' }`
- Discriminated unions para estados: `type Status = 'DRAFT' | 'PUBLISHED' | ...`

### Funções
- Use `useCallback` para evitar re-renders
- Use `useEffect` com dependeíncias apropriadas
- Sempre tipifique parameters e return

### Componentes
- Componentes são Funções (FC não é necessário)
- Use Props interface para cada componente
- Destructure props com tipos

## Performance

### Auto-save com Debounce
```typescript
const debouncedSave = debounce(saveDatabase, 1000);

useEffect(() => {
  debouncedSave();
}, [data, debouncedSave]);
```

### Memoíata de Cálculos
```typescript
const total = useMemo(
  () => calculateWorkOrderTotal(items),
  [items]
);
```

### Re-render Otimizado
```typescript
useCallback(() => {
  // Função só recriada se dependeíncias mudam
}, [dependency])
```

## Integração com Tauri

```typescript
// Invocar comando Rust
await invoke('comando_rust', {
  param1: 'valor1',
  param2: 'valor2'
});
```

## Backup e Sincronização

### Auto-backup
- Executa diariamente ou semanalmente (configurável)
- Salva em arquivo local
- Opção de upload para cloud

### Cloud Sync (Futuro)
- Sincronização bidirecional
- Conflict resolution
- Offline-first

## Segurança

- Validação de entrada
- Sanitização de dados
- Criptografia local (futuro)
- Autenticação (futuro)

## Roadmap

### MVP
- [x] Estrutura base
- [x] Kanban board
- [ ] Modais CRUD
- [ ] Financeiro com gráficos
- [ ] CRM básico

### Phase 2
- [ ] Relatórios PDF
- [ ] Sincronização cloud
- [ ] Autenticación
- [ ] Backup automático

### Phase 3
- [ ] Mobile app
- [ ] API REST
- [ ] Integrações (NotaFiscal, etc)
- [ ] Analytics
