# Checklist de Desenvolvimento - Oficina PRO

## Phase 1: MVP (Milestone de Base) - ✅ COMPLETO

### Estrutura e Configuração ✅
- [x] Inicializar projeto React + TypeScript
- [x] Configurar Vite
- [x] Configurar Tauri (estrutura básica)
- [x] Setup npm scripts
- [x] Gitignore e configuração inicial

### Type System ✅
- [x] Definir tipos principais (WorkOrder, Client, LedgerEntry)
- [x] Definir tipos de UI State
- [x] UUID branded type
- [x] Discriminated unions para status

### Context API ✅
- [x] DatabaseContext com estado global
- [x] Métodos CRUD para WorkOrder
- [x] Métodos CRUD para Client
- [x] Métodos CRUD para LedgerEntry
- [x] Métodos CRUD para Service
- [x] Métodos CRUD para Part
- [x] Auto-save com debounce
- [x] Método loadDatabase
- [x] Método saveDatabase

### Componentes Base ✅
- [x] App principal com navegação
- [x] KanbanBoard com drag & drop
- [x] Header com branding
- [x] Navigation tabs

### Utilidades ✅
- [x] Helpers (formatação, cálculo, criação)
- [x] Validadores (todos os tipos)
- [x] UUID generation
- [x] Formatação de moeda, data, telefone

### Estilos ✅
- [x] CSS variables (cores, spacing, shadows)
- [x] Estilos globais
- [x] App layout styles
- [x] Kanban board styles
- [x] Responsive design mobile-first

### Documentação ✅
- [x] README com instruções
- [x] ARQUITETURA.md
- [x] Arquitetura de pastas
- [x] Convenções de código

---

## Phase 2: Componentes Interativos - 🔄 EM PROGRESSO

### Modais
- [ ] Modal base (reusável)
- [ ] Modal de O.S. (criar/editar)
  - [ ] Seleção de cliente
  - [ ] Adicião de itens (serviços/peças)
  - [ ] Cálculo automático de total
  - [ ] Notas públicas e internas
- [ ] Modal de Cliente (criar/editar)
  - [ ] Validacao de telefone/email
  - [ ] Lista de veículos
- [ ] Modal de Lançamento Financeiro
  - [ ] Tipo (receita/despesa)
  - [ ] Parcelamento
  - [ ] Vencimento
- [ ] Modal de Confirmação
- [ ] Modal de Alertas/Erros

### Formulários
- [ ] Form Base com validação em tempo real
- [ ] Input Text reusável
- [ ] Input Currency reusável
- [ ] Input Date reusável
- [ ] Input Phone reusável
- [ ] Select com busca
- [ ] Multi-select
- [ ] Textarea
- [ ] Checkbox e Radio

### Componentes de Exibição
- [ ] Card reusável
- [ ] Badge para status
- [ ] Empty state
- [ ] Loading spinner
- [ ] Error boundary
- [ ] Tooltip
- [ ] Breadcrumb

### Tabelas
- [ ] Table component reusável
- [ ] Sorting
- [ ] Filtragem
- [ ] Paginação
- [ ] Seleção de linhas

---

## Phase 3: Funcionalidades do Workshop - 📋 TODO

### Tab Oficina (Workshop)
- [ ] Listar todas as O.S.
- [ ] Filtros avancádos (status, cliente, data)
- [ ] Busca por O.S. ID
- [ ] Botão "+ Nova O.S."
- [ ] Ações na card (editar, deletar, visualizar)
- [ ] Visualizador de O.S. detalhada
- [ ] Impressão de O.S.
- [ ] Geração de PDF
- [ ] Status history timeline
- [ ] Cálculo automático de tempo estimado

### Catálogo
- [ ] Gerenciador de Serviços
  - [ ] CRUD completo
  - [ ] Categorias de serviços
  - [ ] Preço dinâmico
  - [ ] Tempo estimado
- [ ] Gerenciador de Peças
  - [ ] CRUD completo
  - [ ] Estoque
  - [ ] Alerta de estoque baixo
  - [ ] Número de parte
  - [ ] Preço de custo vs venda

---

## Phase 4: Funcionalidades Financeiras - 💰 TODO

### Tab Financeiro
- [ ] Dashboard financeiro
  - [ ] Receita total (mês/ano)
  - [ ] Despesa total (mês/ano)
  - [ ] Saldo (mês/ano)
  - [ ] Gráficos comparativos
  - [ ] Gráfico de tendência

### Lançamentos
- [ ] Listagem de lançamentos
- [ ] Filtros (período, tipo, categoria)
- [ ] Adicião de receita
- [ ] Adição de despesa
- [ ] Edição de lançamento
- [ ] Deleção de lançamento
- [ ] Vinculação com O.S.
- [ ] Parcelamentos
  - [ ] Criar parcelamento
  - [ ] Visualizar parcelas
  - [ ] Marcar como pago
  - [ ] Gerar avisos de vencimento

### Relatórios
- [ ] Relatório mensal
- [ ] Relatório anual
- [ ] Fluxo de caixa
- [ ] Top serviços
- [ ] Top clientes
- [ ] Ticket médio

---

## Phase 5: CRM - 👥 TODO

### Tab CRM
- [ ] Dashboard de clientes
  - [ ] Total de clientes
  - [ ] Clientes ativos
  - [ ] Cliente VIP (maior gasto)
  - [ ] Novos clientes (este mês)

### Gerenciamento de Clientes
- [ ] Listagem de clientes
- [ ] Busca avancada
- [ ] Filtros
- [ ] Criar novo cliente
- [ ] Editar cliente
- [ ] Deletar cliente (com confirmação)
- [ ] Visualizar histórico de O.S.
- [ ] Contato (tel/email)
- [ ] Notas do cliente

### Veículos
- [ ] Listagem de veículos por cliente
- [ ] Adicionar veículo
- [ ] Editar veículo
- [ ] Remover veículo
- [ ] Último serviço realizado
- [ ] Sugestões de manutenção

---

## Phase 6: Configurações - ⚙️ TODO

### Tab Configurações
- [ ] Dados da Oficina
  - [ ] Nome
  - [ ] CNPJ
  - [ ] Telefone
  - [ ] Endereço
  - [ ] Logo
- [ ] Preferências
  - [ ] Tema (light/dark)
  - [ ] Idioma
  - [ ] Moeda
  - [ ] Sepador decimal
- [ ] Backup
  - [ ] Fazer backup manual
  - [ ] Auto-backup ON/OFF
  - [ ] Frequência auto-backup
  - [ ] Localização dos backups
  - [ ] Restaurar backup
- [ ] Sincronização Cloud
  - [ ] Conectar Google Drive
  - [ ] Conectar Dropbox
  - [ ] Status de sincronização

---

## Phase 7: Backend (Tauri/Rust) - 🦀 TODO

### Database
- [ ] Schema SQLite
- [ ] Migrations
- [ ] Queries CRUD
- [ ] Indexes
- [ ] Backup local

### Tauri Commands
- [ ] save_database
- [ ] load_database
- [ ] create_backup
- [ ] restore_backup
- [ ] export_pdf
- [ ] export_csv
- [ ] validate_database

### File Management
- [ ] Salvar PDFs
- [ ] Salvar Backups
- [ ] Gerenciar Downloads
- [ ] Sincronização Cloud

---

## Phase 8: Integrações Externas - 🔗 TODO

- [ ] Google Drive (backup)
- [ ] Dropbox (backup)
- [ ] SMTP (envio de email)
- [ ] WhatsApp (notificações)
- [ ] NFe (nota fiscal eletrônica)

---

## Phase 9: Testing - 🧪 TODO

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests
- [ ] Coverage > 80%

---

## Phase 10: Release - 🚀 TODO

- [ ] Build Windows
- [ ] Build macOS
- [ ] Build Linux
- [ ] Assinatura digital
- [ ] Instalador
- [ ] Auto-update
- [ ] Release notes

---

## Bugs Conhecidos

> Nenhum no momento

## Notas Importantes

1. **Auto-save**: Implementado com debounce de 1s
2. **Offline-first**: Todos os dados são locais
3. **Type Safety**: 100% TypeScript strict mode
4. **Responsive**: Mobile-first desde o começo

## Como Contribuir

1. Escolha uma tarefa do checklist
2. Crie uma branch: `git checkout -b feature/nome`
3. Implemente com testes
4. Faça commit com mensagem clara
5. Abra PR para revisão

## Próximo Passo

**Atual**: Phase 2 - Componentes Interativos

**Próximo**: Criar componentes de modais e formulários
