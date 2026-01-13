# 🚀 Oficina PRO ERP - Backend API

## 🏛️ Arquitetura Escalvel e Profissional

### **Stack Tecnológica:**
- ✅ **Node.js 20** + **TypeScript**
- ✅ **Express** (Framework web)
- ✅ **Prisma ORM** (Type-safe database access)
- ✅ **PostgreSQL 16** (Banco de dados)
- ✅ **JWT** (Autenticação)
- ✅ **Zod** (Validação de schemas)
- ✅ **Docker** (Containerização)
- ✅ **Swagger** (Documentação da API)
- ✅ **Jest** (Testes)
- ✅ **Winston** (Logs)

---

## 📚 ÍNDICE

1. [Estrutura do Projeto](#estrutura-do-projeto)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Rodando o Projeto](#rodando-o-projeto)
5. [Modelos de Dados](#modelos-de-dados)
6. [Endpoints da API](#endpoints-da-api)
7. [Autenticação](#autenticação)
8. [Escalabilidade](#escalabilidade)
9. [Próximos Passos](#próximos-passos)

---

## 📁 ESTRUTURA DO PROJETO

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   ├── migrations/            # Migrações do banco
│   └── seed.ts                # Seeds de dados
├── src/
│   ├── config/
│   │   ├── database.ts         # Conexão Prisma
│   │   └── swagger.ts          # Config Swagger
│   ├── controllers/          # Controllers da API
│   │   ├── auth.controller.ts
│   │   ├── client.controller.ts
│   │   ├── workOrder.controller.ts
│   │   └── ...
│   ├── middlewares/          # Middlewares
│   │   ├── auth.ts             # Autenticação JWT
│   │   ├── errorHandler.ts     # Error handling
│   │   └── rateLimiter.ts      # Rate limiting
│   ├── routes/               # Rotas da API
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   └── ...
│   ├── services/             # Lógica de negócio
│   │   ├── auth.service.ts
│   │   └── ...
│   ├── repositories/         # Camada de dados
│   │   ├── user.repository.ts
│   │   └── ...
│   ├── utils/                # Utilitários
│   │   ├── logger.ts
│   │   └── AppError.ts
│   ├── validators/           # Schemas Zod
│   ├── types/                # TypeScript types
│   ├── app.ts                # Config Express
│   └── server.ts             # Entry point
├── tests/                    # Testes automatizados
├── logs/                     # Arquivos de log
├── uploads/                  # Uploads de arquivos
├── .env.example              # Variáveis de ambiente
├── docker-compose.yml        # Docker Compose
├── Dockerfile                # Docker image
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ INSTALAÇÃO

### **1. Pré-requisitos:**
- Node.js 18+
- PostgreSQL 14+ (ou Docker)
- npm ou yarn

### **2. Clonar e instalar dependências:**
```bash
cd backend
npm install
```

### **3. Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### **4. Rodar com Docker (recomendado):**
```bash
# Subir todos os serviços (PostgreSQL, Redis, API, PgAdmin)
docker-compose up -d

# Rodar migrations
npm run prisma:migrate

# Seed inicial (opcional)
npm run prisma:seed
```

### **5. Rodar localmente (sem Docker):**
```bash
# Certifique-se de ter PostgreSQL rodando

# Gerar Prisma Client
npm run prisma:generate

# Rodar migrations
npm run prisma:migrate

# Modo desenvolvimento
npm run dev

# Build e produção
npm run build
npm start
```

---

## ⚙️ CONFIGURAÇÃO

### **Variáveis de Ambiente (.env):**

```env
# Application
NODE_ENV=development
PORT=3333
API_URL=http://localhost:3333
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 📄 MODELOS DE DADOS

### **Principais Entidades:**

#### **User** (Usuários do sistema)
```typescript
{
  id: string
  email: string
  password: string (hashed)
  name: string
  role: 'ADMIN' | 'MANAGER' | 'MECHANIC' | 'RECEPTIONIST'
  isActive: boolean
}
```

#### **Client** (Clientes)
```typescript
{
  id: string
  name: string
  email?: string
  phone: string
  cpf?: string
  address?: string
  vehicles: Vehicle[]
}
```

#### **Vehicle** (Veículos)
```typescript
{
  id: string
  clientId: string
  brand: string
  model: string
  year?: number
  plate?: string
  vin?: string
}
```

#### **WorkOrder** (Ordens de Serviço)
```typescript
{
  id: string
  clientId: string
  vehicleId?: string
  status: 'ESTIMATE' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  items: WorkOrderItem[]
  total: Decimal
  assignedToId?: string
}
```

#### **Service** (Catálogo de Serviços)
```typescript
{
  id: string
  name: string
  description?: string
  price: Decimal
  estimatedTime?: Decimal
  categoryId?: string
}
```

#### **Part** (Peças/Estoque)
```typescript
{
  id: string
  code: string
  name: string
  price: Decimal
  stock: number
  minStock: number
  supplierId?: string
}
```

**Veja o schema completo em:** `prisma/schema.prisma`

---

## 🔗 ENDPOINTS DA API

### **Base URL:** `http://localhost:3333/api/v1`

### **Autenticação:**
```
POST   /auth/register       - Registrar novo usuário
POST   /auth/login          - Login
POST   /auth/refresh        - Refresh token
GET    /auth/me             - Usuário atual
POST   /auth/logout         - Logout
```

### **Clientes:**
```
GET    /clients             - Listar clientes
GET    /clients/:id         - Detalhes do cliente
POST   /clients             - Criar cliente
PUT    /clients/:id         - Atualizar cliente
DELETE /clients/:id         - Excluir cliente
```

### **Veículos:**
```
GET    /vehicles            - Listar veículos
GET    /vehicles/:id        - Detalhes do veículo
POST   /vehicles            - Criar veículo
PUT    /vehicles/:id        - Atualizar veículo
DELETE /vehicles/:id        - Excluir veículo
```

### **Ordens de Serviço:**
```
GET    /work-orders         - Listar O.S.
GET    /work-orders/:id     - Detalhes da O.S.
POST   /work-orders         - Criar O.S.
PUT    /work-orders/:id     - Atualizar O.S.
PATCH  /work-orders/:id/status - Mudar status
DELETE /work-orders/:id     - Excluir O.S.
```

### **Serviços:**
```
GET    /services            - Listar serviços
GET    /services/:id        - Detalhes do serviço
POST   /services            - Criar serviço
PUT    /services/:id        - Atualizar serviço
DELETE /services/:id        - Excluir serviço
```

### **Peças:**
```
GET    /parts               - Listar peças
GET    /parts/:id           - Detalhes da peça
POST   /parts               - Criar peça
PUT    /parts/:id           - Atualizar peça
POST   /parts/:id/stock     - Ajustar estoque
DELETE /parts/:id           - Excluir peça
```

### **Financeiro:**
```
GET    /ledger              - Listar lançamentos
GET    /ledger/summary      - Resumo financeiro
POST   /ledger              - Criar lançamento
PUT    /ledger/:id          - Atualizar lançamento
DELETE /ledger/:id          - Excluir lançamento
```

### **Agendamentos:**
```
GET    /appointments        - Listar agendamentos
GET    /appointments/:id    - Detalhes do agendamento
POST   /appointments        - Criar agendamento
PUT    /appointments/:id    - Atualizar agendamento
DELETE /appointments/:id    - Excluir agendamento
```

**Documentação completa:** `http://localhost:3333/api-docs`

---

## 🔐 AUTENTICAÇÃO

### **Formato do Token:**
```
Authorization: Bearer <JWT_TOKEN>
```

### **Exemplo de Login:**
```bash
curl -X POST http://localhost:3333/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@oficinapro.com",
    "password": "senha123"
  }'
```

### **Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@oficinapro.com",
      "name": "Admin",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **Roles e Permissões:**
- **ADMIN**: Acesso total
- **MANAGER**: Gestão de oficina
- **MECHANIC**: Ordens de serviço
- **RECEPTIONIST**: Clientes e agendamentos

---

## 🚀 ESCALABILIDADE

### **Princípios Implementados:**

#### 1. **Clean Architecture**
- Separação de camadas (Controllers, Services, Repositories)
- Baixo acoplamento
- Fácil de testar

#### 2. **Repository Pattern**
- Abstração da camada de dados
- Fácil trocar banco de dados
- Mock fácil para testes

#### 3. **Dependency Injection**
- Injeção de dependências
- Facilita testes unitários

#### 4. **Type Safety**
- TypeScript em 100%
- Prisma type-safe
- Zod para validação

#### 5. **Error Handling**
- Middleware centralizado
- Erros customizados
- Logs estruturados

#### 6. **Security**
- Helmet (segurança HTTP)
- Rate limiting
- JWT authentication
- Input validation (Zod)

#### 7. **Performance**
- Prisma (queries otimizadas)
- Redis caching (opcional)
- Indexes no banco

---

## 📝 PRÓXIMOS PASSOS

### **1. Implementar Controllers Restantes:**
- `client.controller.ts`
- `vehicle.controller.ts`
- `workOrder.controller.ts`
- `service.controller.ts`
- `part.controller.ts`
- `ledger.controller.ts`
- `appointment.controller.ts`

### **2. Criar Services Layer:**
- `auth.service.ts`
- `client.service.ts`
- `workOrder.service.ts`
- etc.

### **3. Criar Repositories:**
- `user.repository.ts`
- `client.repository.ts`
- etc.

### **4. Testes:**
- Unit tests (Jest)
- Integration tests
- E2E tests

### **5. Features Avançadas:**
- Upload de arquivos (multer)
- Envio de emails (nodemailer)
- Notificações push
- Relatórios PDF
- Integração WhatsApp

### **6. DevOps:**
- CI/CD (GitHub Actions)
- Deploy (AWS, Heroku, etc.)
- Monitoring (Sentry, DataDog)
- Backup automatizado

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **Prisma Docs:** https://www.prisma.io/docs
- **Express Docs:** https://expressjs.com
- **TypeScript Docs:** https://www.typescriptlang.org/docs
- **Zod Docs:** https://zod.dev
- **JWT Docs:** https://jwt.io

---

## 👨‍💻 DESENVOLVEDOR

**Gabriel Hiraoka**
- Email: hiraokagabriel@gmail.com
- GitHub: @hiraokagabriel

---

## 📄 LICENÇA

MIT License

---

**Status**: ✅ **Base do backend completa e pronta para desenvolvimento**

**Próximo passo**: Implementar controllers restantes seguindo o padrão do `auth.controller.ts`
