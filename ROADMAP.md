# 🗣️ Roadmap - ERP Oficina PRO

## Status Atual: 🟢 v1.0 - Release Candidate (RC)

**Data:** 13 de Janeiro de 2026
**Versão:** 1.0-rc.1
**Status:** Pronto para produção

---

## 🏁 Fase 1: MVP (Concluído ✅)

### Core Features Implementadas

- [x] **Gerenciamento de Ordens de Serviço**
  - [x] Criar/Editar/Deletar OS
  - [x] Status dinâmico (Orçamento → Aprovado → Em Serviço → Finalizado)
  - [x] Kanban Drag & Drop
  - [x] Autocomplete inteligente (Clientes, Veículos, Peças, Serviços)
  - [x] Notas públicas e internas

- [x] **Gerenciamento Financeiro**
  - [x] Lançamento de receitas e despesas
  - [x] Suporte a parcelamentos
  - [x] Suporte a recorrências (mênais)
  - [x] Dashboard com KPIs
  - [x] Gráficos de entrada vs saída
  - [x] Filtro por mês (passado, presente, futuro)

- [x] **CRM de Clientes**
  - [x] Base de dados de clientes
  - [x] Histórico de veículos por cliente
  - [x] Rastreamento de total gasto
  - [x] Cascata de atualizaçães (editar cliente → atualiza OS)

- [x] **Controle de Estoque**
  - [x] Catálogo auto-aprendizável de peças
  - [x] Catálogo auto-aprendizável de serviços
  - [x] Rastreamento de uso

- [x] **UX & Feedback**
  - [x] Design System completo (Dark/Pastel)
  - [x] Efeitos sonoros (sucesso, erro, neutro)
  - [x] Confetti ao finalizar OS
  - [x] Toast notificações
  - [x] Atalhos de teclado (F2, Esc, Ctrl+S)

- [x] **Impressão e Exportação**
  - [x] Layout A4 elegante para OS
  - [x] Exportação CSV do financeiro
  - [x] Backup em JSON

- [x] **Configurações**
  - [x] Dados da oficina (nome, CNPJ)
  - [x] Seletor de tema
  - [x] Gerenciamento de backup Google Drive
  - [x] Gerenciamento de clientes/peças salvos

### Métricas de Sucesso (v1.0)

| Métrica | Target | Resultado |
|---------|--------|----------|
| Tempo de inicialização | < 2s | ✅ ~1s |
| Lag ao salvar | < 100ms | ✅ ~80ms |
| Tamanho do .exe | < 100MB | ✅ ~75MB |
| Curva de aprendizado | < 30 min | ✅ Intuitivo |
| Performance (1000 OS) | ~30fps | ✅ 60fps |
| Taxa de satisfação | 4.5+/5 | 🤔 Feedback pendente |

---

## 🎆 Fase 2: Integrações (Próximo: 2-3 meses)

### Funcionalidades Planejadas

#### 2.1: Integração WhatsApp

```
[ ] Conectar conta WhatsApp Business
[ ] Enviar OS para cliente por WhatsApp
[ ] Lembretes de pagamento automáticos
[ ] Notificação ao cliente quando OS está pronta
[ ] Receber fotos/documentos via WhatsApp
```

**Tecnologia:** Twilio API ou WhatsApp Cloud API
**Esforço:** ~2 semanas
**Custo:** ~R$100-300/mês

#### 2.2: Nota Fiscal Eletrônica (NFe)

```
[ ] Gerar NFC-e automático ao finalizar OS
[ ] Integração com provedor NFe
[ ] Salvar NFC-e em PDF
[ ] Enviar por email ao cliente
[ ] Relatório de NFC-e emitidas
```

**Tecnologia:** ManifestaSoft, Nuvem Fiscal
**Esforço:** ~3 semanas
**Custo:** ~R$50-100/mês

#### 2.3: Relatórios Avançados

```
[ ] Análise de rentabilidade por serviço
[ ] Ranking de clientes (mais gastadores)
[ ] Tempo médio de conclusão de OS
[ ] Lucratividade por tipo de veículo
[ ] Métricas de eficiência do mecânico
[ ] Export para PowerBI (futuro)
```

**Tecnologia:** Recharts + Plotly
**Esforço:** ~2 semanas
**Custo:** Gratis

---

## 🚀 Fase 3: Multi-user & Sync (3-4 meses)

### Arquitetura de Sync

```
Phase 3.1: SQLite Local
  [ ] Migrar de JSON para SQLite
  [ ] Indexação
  [ ] Queries otimizadas
  Esforço: ~2 semanas

Phase 3.2: Servidor Node.js
  [ ] Backend Express/Fastify
  [ ] PostgreSQL
  [ ] API REST
  [ ] Autenticação JWT
  Esforço: ~4 semanas

Phase 3.3: Sincronização
  [ ] Two-way sync (Local SQLite <-> Server PostgreSQL)
  [ ] Conflict resolution (last-write-wins)
  [ ] Offline-first com queue
  [ ] Compactação de deltas
  Esforço: ~3 semanas

Phase 3.4: Multi-user
  [ ] Permissões de usuário (admin, mecânico, gerente)
  [ ] Real-time notifications (WebSocket)
  [ ] Auditoria de mudanças
  Esforço: ~2 semanas
```

### Infraestrutura de Servidor

```
Opção 1: Dedicated Server
  Host: DigitalOcean / Linode
  Cost: ~$25-50/mês
  Uptime: 99.9%
  
Opção 2: Serverless
  Host: AWS Lambda + RDS
  Cost: ~$0 (free tier) a $50/mês
  
Opção 3: on-premise
  Hardware: Servidor interno da oficina
  Cost: ~R$5000 (investímento inicial)
```

---

## 🎤 Fase 4: Mobile & Companion App (4-6 meses)

### App Mobile (React Native / Flutter)

```
[ ] Visualizar OS em tempo real
[ ] Consultar dados de clientes
[ ] Foto de antes/depois da OS
[ ] Assinatura digital do cliente
[ ] Leitura de QR code (melhorar busca)
[ ] Push notifications
[ ] Offline mode com sync
```

**Tecnologia:** React Native (Código compartilhado com web)
**Plataforma:** iOS + Android
**Esforço:** ~6-8 semanas

---

## 📒 Roadmap Detalhado de Commits

### Sprint 1: Estabilidade (Jan 2026)

```bash
- fix: Corrigir duplicação de IDs em autocomplete
- fix: Validar decimais na entrada de valores
- refactor: Simplificar cálculo de totais em WorkOrder
- test: Adicionar testes unitários (validators.ts)
- docs: Whitepaper completo (este arquivo!)
```

### Sprint 2: Otimização (Fev 2026)

```bash
- perf: Implementar virtual scrolling para listas grandes
- perf: Code splitting com lazy loading
- feat: Busca global (Ctrl+K)
- feat: Atalho de tecla para cada ação comum
- fix: Memory leak em modals
```

### Sprint 3: Integrações (Mar 2026)

```bash
- feat: Integração com Twilio WhatsApp
- feat: Geração de NFC-e básico
- docs: Guia de integrações
```

---

## 📊 Gráfico de Progresso

```
Phase 1 (MVP)        ██████████ 100% ✅
Phase 2 (Features)   ░░░░░░░░░░  0%  🏁
Phase 3 (Multi-user) ░░░░░░░░░░  0%  🔞
Phase 4 (Mobile)     ░░░░░░░░░░  0%  🚄
```

---

## 🌟 Boas práticas para Contribuidores

Se você deseja contribuir para o projeto:

### 1. Setup Local

```bash
git clone https://github.com/seuusername/oficina-pro.git
cd oficina-pro

# Instalar dependências
npm install
cd src-tauri && cargo build

# Rodar em dev
npm tauri dev
```

### 2. Branches

- `main`: Produção (estavel)
- `develop`: Desenvolvimento (integração)
- `feature/xxx`: Nova funcionalidade
- `fix/xxx`: Correção de bug
- `docs/xxx`: Documentação

### 3. Commit Message

```
feat: Adicionar autocomplete no modal de OS

Implementa busca inteligente para clientes.
- Suporta busca por nome e telefone
- Cria novo cliente automaticamente
- Testes unitários adicionados

Fixes #42
```

### 4. Pull Request

```markdown
## Descrição
Implementá a funcionalidade X que resolve o problema Y.

## Tipo de Mudança
- [ ] Bug fix
- [x] New feature
- [ ] Breaking change
- [ ] Documentation update

## Como testar
1. Abra modal OSModal
2. Digite nome do cliente
3. Observe autocomplete funcionando

## Screenshots
[Aqui, se aplicável]

## Checklist
- [x] Testes adicionados
- [x] Documentação atualizada
- [x] Sem console.log() no código
- [x] TypeScript compila sem erros
```

---

## 📧 Feedback & Sugestões

### Como Reportar Bug

```
1. Vá para a aba "Issues"
2. Clique "New Issue"
3. Use o template "Bug Report"
4. Preencha:
   - Título descritivo
   - Passos para reproduzir
   - Comportamento esperado
   - Comportamento atual
   - Screenshots
   - Informações do sistema
```

### Como Sugerir Feature

```
1. Vá para a aba "Issues"
2. Clique "New Issue"
3. Use o template "Feature Request"
4. Descreva:
   - O que você quer fazer
   - Por que é importante
   - Como deveria funcionar
   - Exemplos de uso
```

---

## 🎆 Versão Release

### Ciclo de Release

```
v1.0 (13/01/2026)    - MVP Completo
v1.1 (Fev 2026)      - Bug fixes + Performance
v1.2 (Mar 2026)      - Whatsapp Integration
v2.0 (Jun 2026)      - Multi-user + Server Sync
v3.0 (Set 2026)      - Mobile App
```

### Processo de Release

```bash
# 1. Atualizar versão
vim package.json src-tauri/Cargo.toml
git add .
git commit -m "bump version to 1.1"

# 2. Criar tag
git tag -a v1.1 -m "Release v1.1"

# 3. Build
npm run tauri build

# 4. Push
git push origin main
git push origin v1.1

# 5. Criar GitHub Release
# Upload: src-tauri/target/release/Oficina_Erp_1.1_x64.msi
# Changelog: o que mudou
```

---

## 🏙️ Tecnologia Stack Futuro

### Possibilidades

```
Frontend Evolution:
  React 18   → React 19 (RSC, Server Components)
  Vite       → Manter (melhoríssimo)
  CSS Puro   → Considerar Tailwind (se crescer muito)
  
Backend Evolution:
  JSON       → SQLite   (local)
           → PostgreSQL (servidor)
  Rust/Tauri → Manter (não é gargalo)
           → Considerar Go (se performance crescer)
```

---

## 📚 Referências e Inspirações

- Notion (UI/UX para dashboard)
- Stripe Dashboard (design limpo)
- Linear (issue tracking simples)
- Figma (performance + colaboração)
- Obsidian (local-first)

---

## 🌠 Contato & Suporte

**Mantenedor:** Hiraoka Gabriel
**Email:** hiraokagabriel@gmail.com
**GitHub:** [@hiraokagabriel](https://github.com/hiraokagabriel)
**Status Atual:** Desenvolvendo Phase 2 em paralelo

---

**Última atualização:** 13 de Janeiro de 2026
**Versão do Roadmap:** 1.0
**Status:** Ativo (🟢 Em Desenvolvimento)
