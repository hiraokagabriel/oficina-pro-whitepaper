# ⚡ OFICINA PRO ERP - QUICKSTART GUIDE

## 🚀 Como Rodar o Projeto Completo

### 📍 **O QUE VOCÊ VAI RODAR:**

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + Express + Prisma
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Admin DB:** PgAdmin 4

---

## 🔧 PRÉ-REQUISITOS

### **Opção 1: Com Docker (Recomendado)**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- Node.js 18+ e npm
- Git

### **Opção 2: Sem Docker**
- Node.js 18+
- PostgreSQL 14+
- Redis (opcional)
- Git

---

## 💻 INSTALAÇÃO COMPLETA

### **1️⃣ Clonar o Repositório**

```bash
git clone https://github.com/hiraokagabriel/oficina-pro-whitepaper.git
cd oficina-pro-whitepaper
```

---

### **2️⃣ Configurar Backend**

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Edite o .env se necessário
# DATABASE_URL já está configurado para Docker
```

**Arquivo `.env` (já vem configurado):**
```env
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://oficina:oficina123@localhost:5432/oficinapro"
JWT_SECRET=oficina-pro-secret-2026
JWT_EXPIRES_IN=7d
```

---

### **3️⃣ Subir Banco de Dados (Docker)**

```bash
# Ainda na pasta backend/
docker-compose up -d

# Verificar se subiu
docker-compose ps
```

**Serviços disponíveis:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- PgAdmin: `http://localhost:5050`

**Credenciais PgAdmin:**
- Email: `admin@oficinapro.com`
- Senha: `admin123`

---

### **4️⃣ Rodar Migrations do Prisma**

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar tabelas no banco
npm run prisma:migrate

# (Opcional) Popular com dados iniciais
npm run prisma:seed
```

---

### **5️⃣ Rodar Backend**

```bash
# Modo desenvolvimento (hot reload)
npm run dev

# Servidor iniciará em http://localhost:3333
```

**Endpoints disponíveis:**
- API: `http://localhost:3333/api/v1`
- Health: `http://localhost:3333/health`
- Docs: `http://localhost:3333/api-docs`

---

### **6️⃣ Configurar Frontend**

**Abra outro terminal:**

```bash
cd ../

# Instalar dependências
npm install

# Criar arquivo .env (se necessário)
echo "VITE_API_URL=http://localhost:3333/api/v1" > .env
```

---

### **7️⃣ Rodar Frontend**

```bash
# Modo desenvolvimento
npm run dev

# Abrirá em http://localhost:5173
```

---

## ✅ VERIFICAÇÃO

### **Checklist:**

- [ ] Docker containers rodando (`docker ps`)
- [ ] Backend respondendo em `http://localhost:3333/health`
- [ ] Frontend acessível em `http://localhost:5173`
- [ ] Swagger docs em `http://localhost:3333/api-docs`

---

## 👨‍💻 PRIMEIRO USO

### **1. Criar Usuário Admin (via API):**

```bash
curl -X POST http://localhost:3333/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@oficinapro.com",
    "password": "admin123",
    "name": "Administrador",
    "role": "ADMIN"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **2. Testar Login no Frontend:**

1. Abra `http://localhost:5173`
2. (Se houver tela de login) Use:
   - Email: `admin@oficinapro.com`
   - Senha: `admin123`

---

## 🛠️ COMANDOS ÚTEIS

### **Docker:**

```bash
# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Reiniciar containers
docker-compose restart

# Remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

### **Prisma:**

```bash
# Abrir Prisma Studio (UI para banco)
npm run prisma:studio
# Abrirá em http://localhost:5555

# Reset do banco (CUIDADO: apaga tudo)
npx prisma migrate reset

# Criar nova migration
npx prisma migrate dev --name nome_da_migration
```

### **Backend:**

```bash
# Rodar testes
npm test

# Build para produção
npm run build
npm start

# Lint
npm run lint
```

### **Frontend:**

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 🐛 TROUBLESHOOTING

### **Problema: Erro ao conectar no banco**

```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Ver logs do PostgreSQL
docker logs oficina-pro-db

# Reiniciar container
docker-compose restart postgres
```

### **Problema: Porta já em uso**

```bash
# Verificar o que está usando a porta
lsof -i :3333  # Backend
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL

# Matar processo
kill -9 <PID>
```

### **Problema: Prisma Client desatualizado**

```bash
# Regenerar Prisma Client
cd backend
npm run prisma:generate
```

### **Problema: node_modules corrompido**

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 PORTAS USADAS

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 3333 | http://localhost:3333 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| PgAdmin | 5050 | http://localhost:5050 |
| Prisma Studio | 5555 | http://localhost:5555 |
| Swagger Docs | 3333 | http://localhost:3333/api-docs |

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Backend README:** [backend/README.md](backend/README.md)
- **Implementation Guide:** [backend/IMPLEMENTATION_GUIDE.md](backend/IMPLEMENTATION_GUIDE.md)
- **Backend Report:** [BACKEND_IMPLEMENTATION_REPORT.md](BACKEND_IMPLEMENTATION_REPORT.md)
- **Frontend Updates:** [ATUALIZACOES_FINAIS_JAN2026.md](ATUALIZACOES_FINAIS_JAN2026.md)

---

## 🚀 PRÓXIMOS PASSOS

### **Para Desenvolvedores:**

1. ✅ Ler [backend/IMPLEMENTATION_GUIDE.md](backend/IMPLEMENTATION_GUIDE.md)
2. ✅ Implementar controllers restantes
3. ✅ Conectar frontend com backend
4. ✅ Adicionar testes

### **Para Usuários:**

1. ✅ Criar conta no sistema
2. ✅ Cadastrar clientes
3. ✅ Criar ordens de serviço
4. ✅ Explorar funcionalidades

---

## ❓ PRECISA DE AJUDA?

- **Issues:** https://github.com/hiraokagabriel/oficina-pro-whitepaper/issues
- **Email:** hiraokagabriel@gmail.com

---

## 🎉 TUDO PRONTO!

Você agora tem:

✅ Frontend rodando  
✅ Backend rodando  
✅ Banco de dados configurado  
✅ Documentação completa  
✅ Sistema pronto para uso e desenvolvimento  

**Divirta-se desenvolvendo! 🚀**

---

**Última Atualização:** 13 de Janeiro de 2026  
**Versão:** 1.0.0
