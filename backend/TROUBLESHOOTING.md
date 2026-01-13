# 🔧 GUIA DE TROUBLESHOOTING - Backend

**Última Atualização:** 13 de Janeiro de 2026

---

## 📝 ÍNDICE

1. [Problemas Comuns de Instalação](#problemas-comuns-de-instalação)
2. [Erros do Node.js/npm](#erros-do-nodejs-npm)
3. [Erros do Prisma](#erros-do-prisma)
4. [Erros do Docker](#erros-do-docker)
5. [Erros de Banco de Dados](#erros-de-banco-de-dados)
6. [Erros em Runtime](#erros-em-runtime)
7. [Instalação do Zero (Passo a Passo)](#instalação-do-zero)

---

## ⚠️ PROBLEMAS COMUNS DE INSTALAÇÃO

### **❌ Erro: "command not found: npm"**

**Problema:** Node.js não está instalado.

**Solução:**

```bash
# Verificar se Node.js está instalado
node --version
npm --version

# Se não estiver instalado:

# Windows:
# Baixe e instale de: https://nodejs.org/ (versão LTS)

# macOS:
brew install node

# Linux (Ubuntu/Debian):
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação:
node --version  # Deve mostrar v18+ ou v20+
npm --version   # Deve mostrar v9+
```

---

### **❌ Erro: "npm install" falha ou trava**

**Possíveis causas:**
- Cache corrompido
- Versão antiga do npm
- Problemas de rede
- Permissões incorretas

**Soluções:**

#### **1. Limpar cache do npm:**
```bash
cd backend
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

#### **2. Atualizar npm:**
```bash
npm install -g npm@latest
npm --version
```

#### **3. Usar modo verboso para ver o erro:**
```bash
npm install --verbose
```

#### **4. Problemas de permissão (Linux/macOS):**
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### **5. Usar yarn como alternativa:**
```bash
npm install -g yarn
yarn install
```

---

### **❌ Erro: "Cannot find module 'typescript'"**

**Problema:** Dependências não foram instaladas corretamente.

**Solução:**

```bash
cd backend

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar se TypeScript foi instalado
npx tsc --version
```

---

### **❌ Erro: "EACCES: permission denied"**

**Problema:** Permissões incorretas (Linux/macOS).

**Solução:**

```bash
# NÃO USE sudo npm install!

# Em vez disso, corrija as permissões:
sudo chown -R $(whoami) backend/
npm install
```

---

## 📦 ERROS DO PRISMA

### **❌ Erro: "Prisma schema not found"**

**Problema:** Arquivo `schema.prisma` não encontrado.

**Solução:**

```bash
cd backend

# Verificar se o arquivo existe
ls -la prisma/schema.prisma

# Se não existir, baixar do repositório:
git pull origin main

# Ou criar manualmente:
mkdir -p prisma
# Copie o conteúdo do schema do repositório
```

---

### **❌ Erro: "Prisma Client not generated"**

**Problema:** Cliente Prisma não foi gerado após instalação.

**Solução:**

```bash
cd backend

# Gerar cliente Prisma
npm run prisma:generate

# Ou diretamente:
npx prisma generate

# Verificar:
ls -la node_modules/.prisma/client
```

---

### **❌ Erro: "P1001: Can't reach database server"**

**Problema:** Banco de dados não está rodando ou URL de conexão incorreta.

**Solução:**

#### **1. Verificar se o Docker está rodando:**
```bash
docker ps

# Se não estiver rodando:
cd backend
docker-compose up -d

# Aguardar 10 segundos
sleep 10

# Verificar logs:
docker-compose logs postgres
```

#### **2. Verificar arquivo .env:**
```bash
cd backend
cat .env

# Deve conter:
DATABASE_URL="postgresql://oficina:oficina123@localhost:5432/oficinapro?schema=public"
```

#### **3. Testar conexão manual:**
```bash
# Conectar ao banco via Docker:
docker exec -it backend-postgres-1 psql -U oficina -d oficinapro

# Se conectar, digite:
\dt
\q
```

---

### **❌ Erro: "Migration failed" ou "P3009"**

**Problema:** Migrations não aplicadas ou conflito.

**Solução:**

```bash
cd backend

# ATENÇÃO: Isso apaga todos os dados!
docker-compose down -v
docker-compose up -d
sleep 10

# Rodar migrations do zero:
npm run prisma:migrate

# Ou criar nova migration:
npx prisma migrate dev --name init
```

---

## 🐳 ERROS DO DOCKER

### **❌ Erro: "docker: command not found"**

**Problema:** Docker não está instalado.

**Solução:**

```bash
# Windows: Baixe Docker Desktop
# https://www.docker.com/products/docker-desktop/

# macOS:
brew install --cask docker

# Linux (Ubuntu):
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Reinicie o terminal

# Verificar:
docker --version
docker-compose --version
```

---

### **❌ Erro: "Cannot connect to Docker daemon"**

**Problema:** Docker não está rodando.

**Solução:**

```bash
# Windows/macOS: Abra o Docker Desktop

# Linux:
sudo systemctl start docker
sudo systemctl enable docker

# Verificar:
docker ps
```

---

### **❌ Erro: "Port 5432 already in use"**

**Problema:** PostgreSQL já está rodando localmente.

**Solução:**

#### **Opção 1: Parar PostgreSQL local:**
```bash
# Windows:
net stop postgresql

# macOS:
brew services stop postgresql

# Linux:
sudo systemctl stop postgresql
```

#### **Opção 2: Mudar porta no docker-compose.yml:**
```yaml
# backend/docker-compose.yml
postgres:
  ports:
    - "5433:5432"  # Usar porta 5433 externamente
```

**Depois atualizar .env:**
```env
DATABASE_URL="postgresql://oficina:oficina123@localhost:5433/oficinapro?schema=public"
```

---

### **❌ Erro: "Port 3333 already in use"**

**Problema:** Outra aplicação está usando a porta 3333.

**Solução:**

```bash
# Encontrar processo usando a porta:
# Windows:
netstat -ano | findstr :3333

# macOS/Linux:
lsof -i :3333

# Matar processo:
# Windows:
taskkill /PID <PID> /F

# macOS/Linux:
kill -9 <PID>

# Ou mudar porta no .env:
PORT=3334
```

---

## 📊 ERROS DE BANCO DE DADOS

### **❌ Erro: "Authentication failed"**

**Problema:** Credenciais incorretas no .env.

**Solução:**

```bash
# Verificar .env:
cat backend/.env

# Deve ser EXATAMENTE:
DATABASE_URL="postgresql://oficina:oficina123@localhost:5432/oficinapro?schema=public"

# Verificar credenciais no docker-compose.yml:
cat backend/docker-compose.yml | grep POSTGRES

# Reiniciar containers:
docker-compose down
docker-compose up -d
```

---

### **❌ Erro: "Database does not exist"**

**Problema:** Banco de dados não foi criado.

**Solução:**

```bash
cd backend

# Recriar containers (apaga dados!):
docker-compose down -v
docker-compose up -d
sleep 10

# Criar database manualmente:
docker exec -it backend-postgres-1 psql -U oficina -c "CREATE DATABASE oficinapro;"

# Rodar migrations:
npm run prisma:migrate
```

---

## ⚡ ERROS EM RUNTIME

### **❌ Erro: "Cannot find module './config/database'"**

**Problema:** Arquivo não foi compilado ou não existe.

**Solução:**

```bash
cd backend

# Verificar se arquivo existe:
ls -la src/config/database.ts

# Se não existir, baixar do git:
git pull origin main

# Limpar e reinstalar:
rm -rf node_modules dist
npm install
npm run dev
```

---

### **❌ Erro: "JWT_SECRET is not defined"**

**Problema:** Variáveis de ambiente não foram carregadas.

**Solução:**

```bash
cd backend

# Verificar se .env existe:
ls -la .env

# Se não existir, criar:
cp .env.example .env

# Editar .env e adicionar:
JWT_SECRET=seu_secret_super_seguro_aqui_com_pelo_menos_32_caracteres

# Reiniciar servidor:
npm run dev
```

---

### **❌ Erro: "CORS policy blocked"**

**Problema:** Frontend não tem permissão para acessar backend.

**Solução:**

```bash
# Editar backend/src/app.ts
# Adicionar origem do frontend:

app.use(cors({
  origin: 'http://localhost:5173', // Porta do Vite
  credentials: true
}));
```

---

## 🚀 INSTALAÇÃO DO ZERO (PASSO A PASSO)

### **✅ CHECKLIST COMPLETO:**

```bash
# 1. Verificar pré-requisitos
node --version    # Deve ser v18+ ou v20+
npm --version     # Deve ser v9+
docker --version  # Qualquer versão recente
git --version     # Qualquer versão

# 2. Clonar repositório (se ainda não clonou)
git clone https://github.com/hiraokagabriel/oficina-pro-whitepaper.git
cd oficina-pro-whitepaper

# 3. Entrar no backend
cd backend

# 4. Criar arquivo .env
cp .env.example .env

# 5. Editar .env (usar nano, vim, ou VSCode)
nano .env
# Ou:
code .env

# Adicionar/verificar:
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://oficina:oficina123@localhost:5432/oficinapro?schema=public"
JWT_SECRET=oficina_pro_jwt_secret_super_seguro_2026
JWT_EXPIRES_IN=7d

# Salvar e sair (Ctrl+O, Enter, Ctrl+X no nano)

# 6. Instalar dependências
npm install

# Se der erro, tentar:
npm cache clean --force
npm install

# 7. Gerar cliente Prisma
npm run prisma:generate

# 8. Iniciar banco de dados (Docker)
docker-compose up -d

# 9. Aguardar banco iniciar
sleep 10

# 10. Verificar se banco está rodando
docker ps
# Deve mostrar containers: postgres, redis, pgadmin

# 11. Rodar migrations
npm run prisma:migrate

# Se pedir nome da migration:
# Digite: init

# 12. Verificar se tabelas foram criadas
npx prisma studio
# Abre navegador em http://localhost:5555
# Deve mostrar todas as tabelas

# 13. Iniciar servidor de desenvolvimento
npm run dev

# 14. Testar em outro terminal:
curl http://localhost:3333/health

# Deve retornar:
# {"status":"ok","timestamp":"..."}

# 15. Testar registro de usuário:
curl -X POST http://localhost:3333/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@oficinapro.com",
    "password": "admin123",
    "name": "Admin",
    "role": "ADMIN"
  }'

# Deve retornar token JWT
```

---

## 📊 COMANDOS ÚTEIS PARA DEBUG

```bash
# Ver logs do Docker
docker-compose logs -f

# Ver logs apenas do PostgreSQL
docker-compose logs -f postgres

# Entrar no container do PostgreSQL
docker exec -it backend-postgres-1 bash

# Conectar ao banco
psql -U oficina -d oficinapro

# Ver tabelas
\dt

# Ver estrutura de uma tabela
\d users

# Sair
\q

# Resetar banco de dados (APAGA TUDO!)
docker-compose down -v
docker-compose up -d
sleep 10
npm run prisma:migrate

# Ver status das migrations
npx prisma migrate status

# Abrir Prisma Studio (UI do banco)
npm run prisma:studio
```

---

## 📞 AINDA COM PROBLEMAS?

### **1. Verificar logs detalhados:**
```bash
cd backend

# Rodar em modo verboso
DEBUG=* npm run dev
```

### **2. Verificar configurações:**
```bash
# Verificar todas as variáveis de ambiente
cat .env

# Verificar versões
node --version
npm --version
docker --version
npx prisma --version
```

### **3. Limpar tudo e começar do zero:**
```bash
cd backend

# Parar e remover containers
docker-compose down -v

# Limpar node_modules
rm -rf node_modules package-lock.json dist

# Limpar cache
npm cache clean --force

# Reinstalar
npm install

# Subir banco
docker-compose up -d
sleep 10

# Migrations
npm run prisma:generate
npm run prisma:migrate

# Rodar
npm run dev
```

---

## 📧 SUPORTE

Se ainda tiver problemas:

1. Copie a mensagem de erro completa
2. Mostre a saída de:
   ```bash
   node --version
   npm --version
   docker --version
   cat backend/.env
   docker ps
   ```
3. Abra uma issue no GitHub com essas informações

---

**Última Atualização:** 13 de Janeiro de 2026  
**Status:** ✅ **Guia Completo de Troubleshooting**

---

# 🔧 BOA SORTE! 🔧
