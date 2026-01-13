# 💪 Quick Reference - ERP Oficina PRO

> Guia rápido para onboarding de novos desenvolvedores

---

## 🗣️ Primeiras 5 Horas

### Hora 1: Setup

```bash
# Clone
git clone https://github.com/seuusername/oficina-erp.git
cd oficina-erp

# Dependencias
npm install
cd src-tauri && cargo build && cd ..

# Dev
npm tauri dev

# Open: http://localhost:3000
```

### Hora 2-3: Explore o Código

```
Principal arquivo:
  App.tsx              → Orquestrador central
  DatabaseContext.tsx  → Estado global
  WorkshopPage.tsx     → Kanban
  FinancialPage.tsx    → Dashboard financeiro

Structura lógica:
  types/index.ts       → TypeScript definitions
  hooks/useFinance.ts  → Cálculos
  styles.css           → Design tokens
  
  src-tauri/src/main.rs → Backend Rust
```

### Hora 4-5: Fazer Primeira PR

```
Escolher uma issue pequena:
  - "fix: Correção de typo"
  - "docs: Melhorar comentário"
  - "refactor: Simplificar função"

Fluxo:
  1. Fork
  2. Branch: git checkout -b fix/typo-in-readme
  3. Editar
  4. Commit: git commit -m "fix: corrigir typo"
  5. PR
```

---

## 📖 Anatomia de um Componente

### Pattern: Modal Formulário

```typescript
// modals/ExemploModal.tsx

interface ExemploModalProps {
  isOpen: boolean;
  onSave: (data: ExemploData) => void;
  onClose: () => void;
  initialData?: ExemploData; // Para edit
}

export function ExemploModal({
  isOpen,
  onSave,
  onClose,
  initialData,
}: ExemploModalProps) {
  // 1. State
  const [formData, setFormData] = useState<ExemploData>(
    initialData || getEmptyData()
  );

  // 2. Handlers
  const handleSave = () => {
    // Validar
    const errors = validate(formData);
    if (errors.length > 0) {
      showToast('error', errors[0]);
      return;
    }

    // Callback para App.tsx
    onSave(formData);
    onClose();
  };

  // 3. Render
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Exemplo</h2>
        
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <input
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}
```

### Pattern: Hook de Lógica

```typescript
// hooks/useExemplo.ts

export function useExemplo(dados: Data[]) {
  return useMemo(() => {
    // Processamento…
    const processado = dados.map(d => ({
      ...d,
      valor_calculado: d.valor * 2,
    }));

    // Retornar derivado
    return {
      processado,
      total: processado.reduce((sum, d) => sum + d.valor_calculado, 0),
      media: processado.length > 0 ? total / processado.length : 0,
    };
  }, [dados]); // única dependência
}
```

---

## 📄 Checklist Antes de Commitar

```
☐ TypeScript compila sem erros: npm run type-check
☐ Sem console.log() ou debugger no código
☐ Formatado: npx prettier --write src/
☐ Nomes descritivos (vars, functions)
☐ Sem dead code
☐ Comments apenas se necessário (código é auto-explicativo)
☐ Testado no navegador
☐ Commit message segue padrão: feat/fix/refactor/docs
☐ Sem mudanças não relacionadas (focus em 1 coisa)
```

---

## 🔧 Troubleshooting

### Problema: Tauri não compila

```bash
# Solução 1: Limpar cache Rust
cd src-tauri
cargo clean
cargo build
cd ..

# Solução 2: Atualizar Rust
rustup update

# Solução 3: Reinstalar dependencias
rm Cargo.lock
cargo build
```

### Problema: React não recarrega (HMR quebrado)

```bash
# Solução: Reiniciar dev server
npm tauri dev

# Se persist: kill Vite
pkill -f "vite"
npm tauri dev
```

### Problema: Database.json corrompido

```bash
# Restaurar backup
cd src-tauri
ls ../src-tauri/target/release/ # Procurar .json backups

# Ou resetar
rm -f database.json
# App vai criar novo vazio na próxima execução
```

---

## 📚 Naming Conventions

### TypeScript

```typescript
// Variables: camelCase
const workOrderList = [];

// Constants: UPPER_SNAKE_CASE
const MAX_ORDERS_PER_PAGE = 50;

// Functions: camelCase + verb
const handleSaveOrder = () => {};
const calculateTotal = (items) => {};
const formatCurrency = (value) => {};

// Types/Interfaces: PascalCase
interface WorkOrder {}
type OrderStatus = 'NOVO' | 'FINALIZADO';

// Components: PascalCase
function WorkshopPage() {}
function OSModal() {}

// CSS Classes: kebab-case
const className = 'card-container';
const className = 'btn-primary';
```

### File Structure

```
  components/
    ├─ KanbanBoard.tsx        # PascalCase
    ├─ KanbanCard.tsx         # Componente dentro de componente
    └─ ui/
       └─ Button.tsx
  
  hooks/
    └─ useFinance.ts         # use + camelCase
  
  utils/
    └─ helpers.ts            # lowercase ou camelCase
  
  modals/
    └─ OSModal.tsx           # PascalCase + Modal suffix
```

---

## 🌔 Atalhos de Teclado (Para Desenvolvimento)

```
No App em Dev:

F2        → Criar nova OS (global)
Esc       → Fechar modal
Ctrl+S    → Force save (se desabilitado)
Ctrl+K    → Busca global (futuro)

No VS Code:

Ctrl+Shift+P   → Command palette
Ctrl+/         → Toggle comentario
Ctrl+H         → Find and replace
Ctrl+Alt+Up    → Duplicate line
Shift+Alt+F    → Format document
```

---

## 📗 Guia de Código Limpo

### ❌ RUIM

```typescript
// Variável com nome ruim
const a = workOrders.filter(x => x.status === 'FINALIZADO').length;

// Função muito grande
function handleAllStuff() {
  // 200 linhas de lógica
}

// Sem type safety
const data = {};
data.something = 'valor';

// Magic numbers
if (value > 100) { // Por que 100?
  doSomething();
}
```

### ✅ BOM

```typescript
// Variável com nome descritivo
const finalizedOrderCount = workOrders.filter(
  order => order.status === 'FINALIZADO'
).length;

// Função pequena e focada
function countFinalizedOrders(workOrders: WorkOrder[]): number {
  return workOrders.filter(order => order.status === 'FINALIZADO').length;
}

// TypeScript com tipos
const data: Database = {
  workOrders: [],
  ledger: [],
};

// Constantes nomeadas
const MINIMUM_ORDER_VALUE = 100;
if (value > MINIMUM_ORDER_VALUE) {
  doSomething();
}
```

---

## 💪 Performance Tips

### 1. Use useMemo para Cálculos

```typescript
// ❌ Recalcula a cada render
const total = items.reduce((sum, item) => sum + item.price, 0);

// ✅ Recalcula apenas se items muda
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);
```

### 2. Use useCallback para Handlers

```typescript
// ❌ Função recriada a cada render
const handleClick = () => { /* ... */ };

// ✅ Função criada apenas 1x
const handleClick = useCallback(() => {
  /* ... */
}, []); // Ou [dependencies]
```

### 3. Lazy Load Páginas

```typescript
// app.tsx
const WorkshopPage = lazy(() => import('./pages/WorkshopPage'));
const FinancialPage = lazy(() => import('./pages/FinancialPage'));

// Só carrega quando necessário
<Suspense fallback={<LoadingSpinner />}>
  {tab === 'workshop' && <WorkshopPage />}
  {tab === 'financial' && <FinancialPage />}
</Suspense>
```

---

## 📦 Estrutura de Tipo Essencial

```typescript
// types/index.ts

// Identidade
type UUID = string & { readonly __brand: 'UUID' };

// Status
type WorkOrderStatus = 
  | 'ORCAMENTO'
  | 'APROVADO'
  | 'EM_SERVICO'
  | 'FINALIZADO'
  | 'ARQUIVADO';

// Dados principais
interface WorkOrder {
  id: UUID;
  clientId: UUID;
  status: WorkOrderStatus;
  totalValue: number;
  items: WorkOrderItem[];
  createdAt: ISO8601;
}

interface LedgerEntry {
  id: UUID;
  type: 'RECEITA' | 'DESPESA';
  value: number;
  date: Date;
}

interface Client {
  id: UUID;
  name: string;
  phone: string;
  vehicles: ClientVehicle[];
}

interface Settings {
  theme: 'dark' | 'pastel';
  officeName: string;
  language: 'pt-BR' | 'en-US';
}
```

---

## 📑 Recursos Úteis

### Documentação
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tauri Docs](https://tauri.app/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)

### Ferramentas
- VS Code + ESLint + Prettier
- GitHub Desktop (ou git CLI)
- Postman (testar API - futuro)
- DevTools React (Chrome Extension)

### Comunidade
- [React Discord](https://discord.gg/react)
- [Tauri Discord](https://discord.com/invite/tauri)
- [StackOverflow](https://stackoverflow.com/)

---

## 🗣️ Perguntas Frequentes (FAQ)

**P: Como adicionar um novo comando Tauri?**
R: Ver [docs/API_TAURI.md](./docs/API_TAURI.md)

**P: Onde colocar um novo hook?**
R: Em `src/hooks/useNomeDaCoisa.ts`

**P: Como mudar tema do Dark para Pastel?**
R: `setTheme('pastel')` → CSS variables automaticamente mudam

**P: Posso usar dependencias externas?**
R: Evite! Se precisar, discuta em uma issue primeiro. Priorizamos código limpo.

**P: O código está comentado?**
R: Apenas quando não é óbvio. Código bom não precisa de comentários.

---

## 🌟 Próximos Passos

1. Lê: [README.md](./README.md) - Visão geral
2. Lê: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Design interno
3. Lê: [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) - Estrutura de dados
4. Explore: `src/App.tsx` → `src/context/DatabaseContext.tsx`
5. Fazer primeira contribuição! 🚀

---

**Bem-vindo ao projeto! 🙋**
