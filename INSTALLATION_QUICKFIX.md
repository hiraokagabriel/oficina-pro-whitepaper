# ⚡ INSTALAÇÃO RÁPIDA DO BACKEND - QUICKFIX

**Se você está tendo problemas, siga estes passos EXATAMENTE nesta ordem:**

---

## 🚀 SCRIPT DE INSTALAÇÃO AUTOMÁTICA

### **Para Linux/macOS:**

```bash
#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}✅ Iniciando instalação do Backend Oficina PRO...${NC}"

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo "Instale Node.js 18+ de: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js encontrado: $(node --version)${NC}"

# 2. Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não encontrado!${NC}"
    echo "Instale Docker de: https://www.docker.com/"
    exit 1
fi

echo -e "${GREEN}✅ Docker encontrado: $(docker --version)${NC}"

# 3. Entrar no diretório backend
cd backend || exit

echo -e "${YELLOW}📦 Limpando instalações antigas...${NC}"

# 4. Limpar tudo
rm -rf node_modules package-lock.json dist
docker-compose down -v 2>/dev/null

echo -e "${YELLOW}📦 Instalando dependências...${NC}"

# 5. Instalar dependências
npm cache clean --force
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependências instaladas!${NC}"

# 6. Criar .env se não existir
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Criando arquivo .env...${NC}"
    cat > .env << 'EOF'
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://oficina:oficina123@localhost:5432/oficinapro?schema=public"
JWT_SECRET=oficina_pro_jwt_secret_super_seguro_2026_change_in_production
JWT_EXPIRES_IN=7d
EOF
    echo -e "${GREEN}✅ Arquivo .env criado!${NC}"
else
    echo -e "${GREEN}✅ Arquivo .env já existe!${NC}"
fi

# 7. Gerar Prisma Client
echo -e "${YELLOW}🔧 Gerando Prisma Client...${NC}"
npm run prisma:generate

echo -e "${YELLOW}🐳 Iniciando Docker containers...${NC}"

# 8. Iniciar Docker
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao iniciar Docker!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker containers iniciados!${NC}"
echo -e "${YELLOW}⏳ Aguardando banco de dados inicializar...${NC}"

# 9. Aguardar banco iniciar
sleep 15

echo -e "${YELLOW}📊 Aplicando migrations...${NC}"

# 10. Rodar migrations
npx prisma migrate dev --name init --skip-generate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao aplicar migrations!${NC}"
    echo -e "${YELLOW}Tentando resetar banco...${NC}"
    npx prisma migrate reset --force --skip-generate
    npx prisma migrate dev --name init --skip-generate
fi

echo -e "${GREEN}✅ Migrations aplicadas!${NC}"

# 11. Testar conexão
echo -e "${YELLOW}🔍 Testando conexão com banco...${NC}"
npx prisma db push --skip-generate

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Para iniciar o servidor:"
echo -e "${YELLOW}npm run dev${NC}"
echo ""
echo "URLs importantes:"
echo "  - API: http://localhost:3333"
echo "  - Health: http://localhost:3333/health"
echo "  - Prisma Studio: npm run prisma:studio"
echo "  - PgAdmin: http://localhost:5050"
echo ""
echo "Credenciais PgAdmin:"
echo "  - Email: admin@oficinapro.com"
echo "  - Senha: admin123"
echo ""
```

**Como usar:**

```bash
# Salvar script
curl -o install-backend.sh https://raw.githubusercontent.com/hiraokagabriel/oficina-pro-whitepaper/main/INSTALLATION_QUICKFIX.md

# Dar permissão
chmod +x install-backend.sh

# Executar
./install-backend.sh
```

---

### **Para Windows (PowerShell):**

```powershell
# install-backend.ps1

Write-Host "✅ Iniciando instalação do Backend Oficina PRO..." -ForegroundColor Green

# 1. Verificar Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Instale Node.js 18+ de: https://nodejs.org/"
    exit 1
}

Write-Host "✅ Node.js encontrado: $(node --version)" -ForegroundColor Green

# 2. Verificar Docker
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker não encontrado!" -ForegroundColor Red
    Write-Host "Instale Docker Desktop de: https://www.docker.com/"
    exit 1
}

Write-Host "✅ Docker encontrado: $(docker --version)" -ForegroundColor Green

# 3. Entrar no diretório
Set-Location backend

Write-Host "📦 Limpando instalações antigas..." -ForegroundColor Yellow

# 4. Limpar
Remove-Item -Recurse -Force node_modules, dist, package-lock.json -ErrorAction SilentlyContinue
docker-compose down -v

Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow

# 5. Instalar
npm cache clean --force
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependências instaladas!" -ForegroundColor Green

# 6. Criar .env
if (!(Test-Path .env)) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Yellow
    @"
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://oficina:oficina123@localhost:5432/oficinapro?schema=public"
JWT_SECRET=oficina_pro_jwt_secret_super_seguro_2026_change_in_production
JWT_EXPIRES_IN=7d
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
}

# 7. Gerar Prisma
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate

Write-Host "🐳 Iniciando Docker..." -ForegroundColor Yellow

# 8. Docker
docker-compose up -d

Write-Host "⏳ Aguardando banco..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "📊 Aplicando migrations..." -ForegroundColor Yellow

# 9. Migrations
npx prisma migrate dev --name init --skip-generate

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ INSTALAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o servidor:"
Write-Host "npm run dev" -ForegroundColor Yellow
```

**Como usar:**

```powershell
# Executar PowerShell como Administrador
# Ir até a pasta do projeto
cd oficina-pro-whitepaper

# Executar script
.\install-backend.ps1
```

---

## 👥 INSTALAÇÃO MANUAL (PASSO A PASSO)

### **1. Pré-requisitos:**

```bash
# Verificar Node.js (precisa ser 18+)
node --version

# Verificar npm
npm --version

# Verificar Docker
docker --version
```

**Se algo não estiver instalado:**
- **Node.js:** https://nodejs.org/ (baixe versão LTS)
- **Docker:** https://www.docker.com/products/docker-desktop/

---

### **2. Limpar instalações antigas:**

```bash
cd backend

# Remover node_modules e cache
rm -rf node_modules package-lock.json dist
npm cache clean --force

# Parar Docker (se estiver rodando)
docker-compose down -v
```

---

### **3. Instalar dependências:**

```bash
npm install

# Se der erro, tentar:
npm install --legacy-peer-deps

# Ou com yarn:
npm install -g yarn
yarn install
```

---

### **4. Criar arquivo .env:**

```bash
cp .env.example .env

# Editar .env (use seu editor favorito)
nano .env
# ou
code .env
# ou
vim .env
```

**Conteúdo do .env:**

```env
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://oficina:oficina123@localhost:5432/oficinapro?schema=public"
JWT_SECRET=oficina_pro_jwt_secret_super_seguro_2026_change_in_production
JWT_EXPIRES_IN=7d
```

---

### **5. Gerar Prisma Client:**

```bash
npm run prisma:generate

# Ou diretamente:
npx prisma generate
```

---

### **6. Iniciar Docker:**

```bash
# Iniciar containers
docker-compose up -d

# Aguardar 15 segundos
sleep 15

# Verificar se está rodando
docker ps

# Deve mostrar 3 containers:
# - backend-postgres-1
# - backend-redis-1
# - backend-pgadmin-1
```

---

### **7. Aplicar Migrations:**

```bash
# Rodar migrations
npm run prisma:migrate

# Se pedir nome, digite: init

# Se der erro, resetar:
npx prisma migrate reset --force
npx prisma migrate dev --name init
```

---

### **8. Iniciar servidor:**

```bash
npm run dev

# Deve mostrar:
# ✅ Server running on http://localhost:3333
# ✅ Database connected
```

---

### **9. Testar:**

**Em outro terminal:**

```bash
# Testar health check
curl http://localhost:3333/health

# Deve retornar:
# {"status":"ok",...}

# Criar usuário admin
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

## ❌ SE AINDA NÃO FUNCIONAR

### **Problema: npm install falha**

```bash
# Tentar com flag diferente
npm install --legacy-peer-deps

# Ou usar yarn
npm install -g yarn
yarn install

# Ou usar pnpm
npm install -g pnpm
pnpm install
```

---

### **Problema: Docker não inicia**

```bash
# Windows/macOS: Abrir Docker Desktop primeiro!

# Linux: Iniciar serviço
sudo systemctl start docker

# Verificar
docker ps
```

---

### **Problema: Porta 5432 em uso**

```bash
# Parar PostgreSQL local
# Windows:
net stop postgresql

# macOS:
brew services stop postgresql

# Linux:
sudo systemctl stop postgresql

# Verificar portas
lsof -i :5432
```

---

### **Problema: Migrations falham**

```bash
# Resetar banco COMPLETAMENTE
docker-compose down -v
docker-compose up -d
sleep 15

# Rodar migrations do zero
npx prisma migrate reset --force
npx prisma migrate dev --name init
```

---

## 📞 SUPORTE

Se **AINDA** não funcionar, envie:

1. **Saída dos comandos:**
```bash
node --version
npm --version
docker --version
cat backend/.env
docker ps
```

2. **Mensagem de erro completa** (copie e cole tudo)

3. **Sistema operacional** (Windows, macOS, Linux)

---

**Data:** 13 de Janeiro de 2026  
**Status:** ✅ **Guia Rápido Completo**

---

# ⚡ BOA SORTE! ⚡
