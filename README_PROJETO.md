# Oficina PRO - ERP para Oficinas Mecânicas

## Status do Projeto

🚧 **Em Desenvolvimento** - Base do projeto criada com sucesso

## O que foi criado

### Estrutura Base
- ✅ **Tipos TypeScript** (`src/types/index.ts`) - Definições de todas as entidades
- ✅ **Utilidades** (`src/utils/helpers.ts`) - Funções auxiliares de formatação e cálculo
- ✅ **Validadores** (`src/utils/validators.ts`) - Validação de dados de entrada
- ✅ **DatabaseContext** (`src/context/DatabaseContext.tsx`) - Geréncia de estado global

### Componentes
- ✅ **KanbanBoard** (`src/components/KanbanBoard.tsx`) - Interface Kanban para O.S.
- ✅ **App** (`src/App.tsx`) - Componente principal com navegação por abas

### Estilos
- ✅ **Global CSS** (`src/styles/globals.css`) - Variáveis CSS e estilos base
- ✅ **App CSS** (`src/styles/App.css`) - Estilos do layout principal
- ✅ **Kanban CSS** (`src/styles/KanbanBoard.css`) - Estilos do Kanban

### Configurações
- ✅ **package.json** - Dependências e scripts
- ✅ **tsconfig.json** - Configuração TypeScript
- ✅ **vite.config.ts** - Configuração Vite
- ✅ **index.html** - HTML entry point

## Próximos Passos

### 1. Componentes de Modais
- [ ] Modal para criar/editar Ordem de Serviço
- [ ] Modal para criar/editar Cliente
- [ ] Modal para criar/editar Lançamento Financeiro
- [ ] Modal de confirmação

### 2. Páginas/Tabs
- [ ] Implementar tab de Financeiro com gráficos
- [ ] Implementar tab de CRM com lista de clientes
- [ ] Implementar tab de Configurações

### 3. Componentes de Catálogo
- [ ] Lista de serviços
- [ ] Lista de peças
- [ ] Gerenciador de catálogo

### 4. Relatórios e Impressão
- [ ] Geração de PDF da O.S.
- [ ] Orçamento impresso
- [ ] Relatórios financeiros

### 5. Backend Rust (Tauri)
- [ ] Implement database persistence
- [ ] Backup functionality
- [ ] File management

## Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- Rust (para Tauri)
- npm ou yarn

### Setup

```bash
# Instalar dependências
npm install

# Verificar tipos TypeScript
npm run type-check

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Arquitetura

### Frontend (React + TypeScript)
- **Context API** para estado global
- **Drag & Drop** para interface Kanban
- **CSS Variables** para temas
- **Responsive Design** mobile-first

### Backend (Tauri + Rust)
- **SQLite** para persistencia local
- **Auto-save** com debounce
- **Backup** automático
- **Sincronização** com cloud (futuro)

## Diretório do Projeto

```
officina-erp/
├── src/
│   ├── components/        # Componentes React
│   ├── context/          # Context API
│   ├── styles/           # CSS
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilidades
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Entry point React
├── public/               # Assets estáticos
├── index.html           # HTML entry point
├── package.json         # Dependências
├── tsconfig.json        # TypeScript config
└── vite.config.ts       # Vite config
```

## Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Tauri** - Desktop framework
- **Rust** - Backend
- **Vite** - Build tool
- **@hello-pangea/dnd** - Drag and drop
- **Recharts** - Gráficos
- **UUID** - ID generation

## Convenções

### Nomes de Arquivo
- Componentes: `PascalCase.tsx`
- Utilidades: `camelCase.ts`
- Estilos: `kebab-case.css`

### Nomes de Variável
- Constantes: `UPPER_SNAKE_CASE`
- Funções: `camelCase`
- Tipos: `PascalCase`

### Status de O.S.
1. **ORCAMENTO** - Orçamento pendente de aprovação
2. **APROVADO** - Aprovação do cliente recebida
3. **EM_SERVICO** - Serviço em andamento
4. **FINALIZADO** - Serviço concluído
5. **ARQUIVADO** - O.S. arquivada/cancelada

## Notas de Desenvolvimento

- Auto-save ocorre 1s após última alteração
- Todos os valores são armazenados sem formatação (números puros)
- UUIDs são gerados automaticamente
- Datas em formato ISO8601
- Suporte local-first (offline-first)

## License

Proprietário - Oficina PRO 2026
