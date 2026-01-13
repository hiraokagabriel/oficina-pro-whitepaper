# 📚 Índice Completo - Oficina PRO

## 🎯 Comece Aqui

1. **PRIMEIRO VEZ?** → Leia [`README_PROJETO.md`](README_PROJETO.md)
2. **ENTENDER ARQUITETURA?** → Veja [`ARQUITETURA.md`](ARQUITETURA.md)
3. **CONFIGURAR BACKEND?** → Leia [`SETUP_TAURI.md`](SETUP_TAURI.md)
4. **RASTREAR PROGRESSO?** → Acesse [`DESENVOLVIMENTO.md`](DESENVOLVIMENTO.md)
5. **VISÃO GERAL?** → Consulte [`RESUMO_PROJETO.md`](RESUMO_PROJETO.md)

---

## 📁 Estrutura de Arquivos

### 🔧 Raiz
```
.
├── 📄 package.json                  Dependências npm
├── 📄 tsconfig.json                 Configuração TypeScript
├── 📄 vite.config.ts                Configuração do bundler
├── 📄 index.html                    HTML entry point
└── 📄 .gitignore                    Git exclusões
```

### 📂 Código Fonte (`src/`)
```
src/
├── 🎨 styles/
│   ├── globals.css                  Estilos globais + CSS variables
│   ├── App.css                      Layout principal
│   └── KanbanBoard.css              Estilos Kanban
├── 🔧 context/
│   └── DatabaseContext.tsx          State management global
├── 📦 components/
│   ├── KanbanBoard.tsx              Drag & drop Kanban
│   └── [WIP] modais/                Componentes de modais (em breve)
├── 📝 types/
│   └── index.ts                     Todas as definições de tipos
├── 🛠️ utils/
│   ├── helpers.ts                   Funções auxiliares
│   └── validators.ts                Validadores de dados
├── 🚀 App.tsx                       Componente principal
└── 📍 main.tsx                      React entry point
```

---

## 📚 Documentação

| Arquivo | Propósito | Para Quem |
|---------|-----------|----------|
| [`README_PROJETO.md`](README_PROJETO.md) | Setup inicial e overview | Todos |
| [`ARQUITETURA.md`](ARQUITETURA.md) | Design técnico e padrões | Desenvolvedores |
| [`DESENVOLVIMENTO.md`](DESENVOLVIMENTO.md) | Checklist de tasks (10 fases) | Product managers |
| [`SETUP_TAURI.md`](SETUP_TAURI.md) | Instruções backend Rust | Backend devs |
| [`RESUMO_PROJETO.md`](RESUMO_PROJETO.md) | Sumário e status | Gestores |
| [`INDICE.md`](INDICE.md) | Este arquivo | Navegação |

---

## 🗂️ Guia por Tipo de Arquivo

### TypeScript/React
- **`src/types/index.ts`** - 150+ linhas de tipos
  - `WorkOrder` - Ordem de serviço
  - `Client` - Cliente
  - `LedgerEntry` - Lançamento financeiro
  - `Service` - Serviço catalogado
  - `Part` - Peça catalogada
  - `Settings` - Configurações da oficina

- **`src/context/DatabaseContext.tsx`** - 300+ linhas
  - Gerenciamento de estado global
  - Auto-save com debounce
  - Métodos CRUD completos
  - Sincronização Tauri

- **`src/components/KanbanBoard.tsx`** - Interface Kanban
  - Drag and drop
  - 4 colunas de status
  - Cards com informações
  - Click para detalhar

- **`src/App.tsx`** - Layout principal
  - Navegação por abas
  - 4 tabs: Oficina, Financeiro, CRM, Config
  - Integration com DatabaseContext

### Utilidades
- **`src/utils/helpers.ts`** - 300+ linhas
  - Formatação (moeda, data, CPF, CNPJ, telefone)
  - Cálculos financeiros
  - Busca e filtro
  - Sorting
  - Geração de UUIDs

- **`src/utils/validators.ts`** - 200+ linhas
  - Validação de WorkOrder
  - Validação de Client
  - Validação de LedgerEntry
  - Validação de Service
  - Validação de Part
  - Validação de CPF/CNPJ/Email/Telefone

### Estilos CSS
- **`src/styles/globals.css`** - 400+ linhas
  - CSS variables sistema
  - Estilos base HTML
  - Dark mode support
  - Responsive utilities

- **`src/styles/App.css`** - 100+ linhas
  - Layout principal flex
  - Header styling
  - Navigation tabs

- **`src/styles/KanbanBoard.css`** - 150+ linhas
  - Grid layout
  - Cards animações
  - Drag & drop feedback

---

## 🎯 Fluxos Principais

### Criar Ordem de Serviço
```
Clique "+ Nova O.S." 
→ Modal abre
  → Seleciona cliente
  → Adiciona itens
  → Valida formulário
  → Submit
    → DatabaseContext.addWorkOrder()
      → setState()
        → Kanban atualiza
        → Auto-save (debounce 1s)
          → Tauri.invoke('save_database')
            → SQLite persiste
              → Auto-backup
```

### Arrastar O.S. entre Colunas
```
Drag card do Kanban
→ Solta em nova coluna
  → Drag handler dispara
  → updateWorkOrder(id, { status: 'NOVO' })
    → setState()
      → Kanban re-renderiza
      → Auto-save ativa
```

### Salvar Automaticamente
```
Qualquer mudança nos dados
→ setState() chamado
  → useEffect detecta mudança
    → Chama debounced saveDatabase()
      → 1s de inatividade
        → Executa saveDatabase()
          → Tauri invoke()
            → Rust persiste
```

---

## 🔑 Conceitos-Chave

### Types & Safety
- **UUID Branded Type** - Tipo seguro para IDs
- **Discriminated Unions** - Estados tipados (ORCAMENTO, APROVADO, etc)
- **Strict Mode** - TypeScript com todas as verificações ativas

### Performance
- **useCallback** - Memoização de funções
- **useMemo** - Memoização de valores calculados
- **Debounce** - Auto-save com 1s delay
- **useEffect deps** - Dependências precisas

### Architecture
- **Context API** - State management
- **Local-first** - Dados persistem localmente
- **Auto-sync** - Debounced auto-save
- **Modular** - Componentes reutilizáveis

---

## 📊 Estatísticas

```
Arquivos TypeScript/TSX:    10 arquivos
Linhas de código:           ~2900 linhas
Componentes React:          3 componentes
Utilidades:                 200+ funções
Tipos definidos:            15+ tipos
Validadores:                5 validadores
```

---

## 🚀 Quick Start

### Instalar
```bash
git clone <repo>
cd oficina-pro-whitepaper
npm install
```

### Desenvolver
```bash
npm run dev
```

### Type Check
```bash
npm run type-check
```

### Build
```bash
npm run build
```

---

## 🔄 Roadmap Resumido

| Phase | Status | Deadline |
|-------|--------|----------|
| **1: MVP Base** | ✅ COMPLETO | 13/01/2026 |
| **2: Modais/Forms** | 🔄 PRÓXIMA | 20/01/2026 |
| **3: Workshop** | ❓ TODO | 27/01/2026 |
| **4: Financeiro** | ❓ TODO | 03/02/2026 |
| **5: CRM** | ❓ TODO | 10/02/2026 |
| **6: Configurações** | ❓ TODO | 17/02/2026 |
| **7: Backend Rust** | ❓ TODO | 24/02/2026 |
| **8-10: Integrações** | ❓ TODO | Março |

---

## 📞 Referência Rápida

### Adicionar Nova Ordem de Serviço
```typescript
const { addWorkOrder } = useDatabaseContext();
const newOrder = createEmptyWorkOrder(clientId);
addWorkOrder(newOrder);
```

### Validar Dados
```typescript
const errors = validateWorkOrder(order);
if (isHasValidationErrors(errors)) {
  const msg = getFirstValidationError(errors);
  showError(msg);
}
```

### Formatar Moeda
```typescript
const formatted = formatCurrency(1234.56); // R$ 1.234,56
```

### Calcular Total de O.S.
```typescript
const total = calculateWorkOrderTotal(items);
```

---

## 🎨 Design System

### Cores
```css
--primary-color: #2196F3;      /* Azul */
--accent-color: #00BCD4;       /* Ciano */
--success-color: #4CAF50;      /* Verde */
--warning-color: #FF9800;      /* Laranja */
--error-color: #F44336;        /* Vermelho */
```

### Breakpoints
```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: 1024px+
```

---

## ✅ Checklist de Features Implementadas

- [x] Estrutura React + TypeScript
- [x] Context API para state
- [x] Kanban board com drag & drop
- [x] Types para WorkOrder, Client, etc
- [x] Validadores de dados
- [x] Helpers de formatação
- [x] CSS variables system
- [x] Dark mode ready
- [x] Responsive design
- [x] Auto-save com debounce
- [x] Documentação completa

---

## 🔗 Links Úteis

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tauri Docs](https://tauri.app/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)

---

## 💡 Tips & Tricks

1. **Type Safety** - Use `as const` para valores readonly
2. **Performance** - Sempre use `useCallback` em dependências
3. **Debugging** - Console.log seu estado no DatabaseContext
4. **Styling** - Use CSS variables do globals.css
5. **Validation** - Sempre validar antes de adicionar ao DB

---

## 🤝 Como Contribuir

1. Escolha tarefa de `DESENVOLVIMENTO.md`
2. Crie branch: `git checkout -b feature/nome`
3. Implemente com testes
4. Faça commit: `git commit -m "feat: descrição"`
5. Abra PR para revisão

---

**Última atualização**: 13 de Janeiro de 2026
**Versão**: 1.0.0-beta
