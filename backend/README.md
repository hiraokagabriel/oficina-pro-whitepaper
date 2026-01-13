# 🔧 Oficina PRO ERP - Backend

## 📋 Visão Geral

Backend escalável e modular desenvolvido com Node.js, Express, TypeScript e PostgreSQL com Prisma ORM.

### Arquitetura em Camadas

```
├── Controllers  (Recebem requisições HTTP)
│   └── Services    (Lógica de negócio)
│       └── Repositories  (Acesso ao banco)
│           └── Prisma Client
```

---

## 🚀 Features

### Core
- ✅ Autenticação JWT com Refresh Token
- ✅ Autorização baseada em roles (ADMIN, MANAGER, MECHANIC, RECEPTIONIST)
- ✅ CRUD completo de Usuários, Clientes, Veículos, O.S.
- ✅ Gestão financeira (lançamentos)
- ✅ Catálogo de serviços e peças
- ✅ Controle de estoque
- ✅ Histórico de status
- ✅ Logs de atividades

### Segurança
- ✅ Helmet (headers HTTP seguros)
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Validação de entrada (Zod)
- ✅ Hash de senhas (bcrypt)
- ✅ JWT com expiração

### Qualidade
- ✅ TypeScript strict mode
- ✅ Error handling centralizado
- ✅ Logging estruturado (Winston)
- ✅ Validações robustas
- ✅ Path aliases

---

## 🛠️ Stack Tecnológica

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (jsonwebtoken)
- **Validação**: Zod
- **Logging**: Winston
- **Segurança**: Helmet, CORS, bcrypt
- **Rate Limiting**: express-rate-limit

---

## 📚 Documentação do Banco de Dados

### Principais Entidades

#### Users (Usuários do sistema)
- **Roles**: ADMIN, MANAGER, MECHANIC, RECEPTIONIST
- Autenticação e autorização
- Soft delete (isActive)

#### Clients (Clientes)
- CPF ou CNPJ (opcional)
- Veículos relacionados
- Histórico de O.S.

#### Vehicles (Veículos)
- Placa, marca, modelo, ano
- Relacionado a cliente

#### WorkOrders (Ordens de Serviço)
- **Status**: ORCAMENTO, APROVADO, EM_SERVICO, FINALIZADO, CANCELADO
- Itens (serviços e peças)
- Descontos
- Histórico de mudanças

#### Services & Parts (Catálogo)
- Serviços com preço e duração
- Peças com estoque
- Categorias

#### LedgerEntries (Lançamentos)
- **Tipo**: RECEITA, DESPESA
- Categorias
- Vinculado a O.S.

---

## 📁 Estrutura de Pastas

```
backend/
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── migrations/        # Migrações
├── src/
│   ├── config/           # Configurações
│   │   └── config.ts
│   ├── controllers/      # Controllers (camada de apresentação)
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   ├── ClientController.ts
│   │   ├── WorkOrderController.ts
│   │   └── ...
│   ├── services/         # Services (lógica de negócio)
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   ├── ClientService.ts
│   │   ├── WorkOrderService.ts
│   │   └── ...
│   ├── middlewares/      # Middlewares
│   │   ├── auth.ts           # Autenticação/autorização
│   │   ├── errorHandler.ts   # Tratamento de erros
│   │   ├── validate.ts       # Validação Zod
│   │   └── rateLimiter.ts    # Rate limiting
│   ├── routes/           # Rotas
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── ...
│   ├── schemas/          # Schemas de validação (Zod)
│   │   ├── auth.schema.ts
│   │   ├── client.schema.ts
│   │   └── workOrder.schema.ts
│   ├── utils/            # Utilitários
│   │   ├── logger.ts         # Winston logger
│   │   └── AppError.ts       # Classe de erro customizada
│   └── server.ts          # Entry point
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 Instalação

### 1. Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 2. Clonar repositório

```bash
git clone <repo>
cd backend
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Editar `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/oficina_pro_db"
JWT_SECRET="seu-secret-super-seguro-min-32-caracteres"
JWT_REFRESH_SECRET="seu-refresh-secret-super-seguro"
```

### 5. Executar migrações

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Iniciar servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

---

## 📚 API Endpoints

### Autenticação

```
POST   /api/v1/auth/register     # Registrar usuário
POST   /api/v1/auth/login        # Login
POST   /api/v1/auth/refresh      # Refresh token
POST   /api/v1/auth/logout       # Logout
```

### Usuários

```
GET    /api/v1/users/me          # Perfil atual
GET    /api/v1/users             # Listar (ADMIN/MANAGER)
GET    /api/v1/users/:id         # Buscar por ID
PUT    /api/v1/users/me          # Atualizar perfil
PUT    /api/v1/users/:id         # Atualizar (ADMIN)
DELETE /api/v1/users/:id         # Deletar (ADMIN)
```

### Clientes

```
GET    /api/v1/clients           # Listar
GET    /api/v1/clients/:id       # Buscar por ID
POST   /api/v1/clients           # Criar
PUT    /api/v1/clients/:id       # Atualizar
DELETE /api/v1/clients/:id       # Deletar (ADMIN/MANAGER)
```

### Ordens de Serviço

```
GET    /api/v1/work-orders       # Listar
GET    /api/v1/work-orders/:id   # Buscar por ID
POST   /api/v1/work-orders       # Criar
PUT    /api/v1/work-orders/:id   # Atualizar
PATCH  /api/v1/work-orders/:id/status  # Atualizar status
DELETE /api/v1/work-orders/:id   # Deletar (ADMIN/MANAGER)
```

### Outros

```
GET /api/v1/vehicles    # Veículos
GET /api/v1/services    # Serviços
GET /api/v1/parts       # Peças
GET /api/v1/ledger      # Lançamentos
```

---

## 🔒 Autenticação

### Header

```
Authorization: Bearer <access_token>
```

### Fluxo

1. **Register/Login** → Recebe `accessToken` + `refreshToken`
2. **Usar accessToken** nas requisições (expira em 1h)
3. **Quando expirar**, usar `/auth/refresh` com `refreshToken`
4. **Recebe novo** `accessToken` + `refreshToken`

---

## 🐛 Tratamento de Erros

### Formato de Resposta

```json
{
  "error": "Mensagem do erro",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Códigos HTTP

- `400` - Bad Request (validação)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found
- `409` - Conflict (duplicação)
- `500` - Internal Server Error

---

## 📦 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento (nodemon)
npm run build            # Build para produção
npm start                # Iniciar produção
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Rodar migrações
npm run prisma:studio    # Interface visual do DB
npm run lint             # Lint
npm run format           # Format
npm test                 # Testes
```

---

## 🚀 Escalonamento

### Horizontal

- Load balancer (Nginx/HAProxy)
- Múltiplas instâncias do backend
- Sessões stateless (JWT)

### Vertical

- Aumentar recursos do servidor
- Otimizar queries (Prisma)
- Cache (Redis)

### Database

- Read replicas
- Connection pooling
- Indexes otimizados

### Future

- Microsserviços (Auth, Orders, Financial)
- Message queue (RabbitMQ/Kafka)
- Event-driven architecture

---

## 📝 Próximos Passos

- [ ] Implementar todos os controllers pendentes
- [ ] Adicionar testes unitários (Jest)
- [ ] Adicionar testes de integração
- [ ] Documentação Swagger/OpenAPI
- [ ] Upload de arquivos (S3/local)
- [ ] Emails transacionais
- [ ] Notificações push
- [ ] WebSockets (status em tempo real)
- [ ] Cache com Redis
- [ ] CI/CD (GitHub Actions)
- [ ] Docker/Docker Compose
- [ ] Monitoramento (Prometheus/Grafana)

---

## 👨‍💻 Autor

**Gabriel Hiraoka**
- Email: hiraokagabriel@gmail.com
- GitHub: @hiraokagabriel

---

## 📄 Licença

MIT License

---

**Última Atualização**: 13 de janeiro de 2026
**Versão**: 1.0.0
**Status**: ✅ MVP Pronto
