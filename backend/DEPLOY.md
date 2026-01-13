# 🚀 Guia de Deploy - Oficina PRO Backend

## 📍 Opções de Deploy

### 1️⃣ Docker (Recomendado)
### 2️⃣ VPS (Ubuntu/Debian)
### 3️⃣ Cloud Platforms (AWS, GCP, Azure)
### 4️⃣ Platform-as-a-Service (Heroku, Railway, Render)

---

## 🐳 Opção 1: Docker

### Pré-requisitos

- Docker 20+
- Docker Compose 2+

### Deploy Local/Desenvolvimento

```bash
# 1. Clonar repositório
git clone <repo>
cd backend

# 2. Criar .env
cp .env.example .env

# 3. Subir containers
docker-compose up -d

# 4. Rodar migrações
docker-compose exec backend npx prisma migrate deploy

# 5. Ver logs
docker-compose logs -f backend
```

### Deploy Produção

```bash
# Build imagem
docker build -t oficina-pro-backend:latest .

# Rodar container
docker run -d \
  --name oficina-pro-backend \
  -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  -e NODE_ENV=production \
  oficina-pro-backend:latest
```

---

## 🖥️ Opção 2: VPS (Ubuntu 22.04)

### 1. Preparar Servidor

```bash
# Conectar via SSH
ssh user@your-server-ip

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar PM2 (process manager)
sudo npm install -g pm2

# Instalar Nginx (reverse proxy)
sudo apt install -y nginx
```

### 2. Configurar PostgreSQL

```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar database e usuário
CREATE DATABASE oficina_pro_db;
CREATE USER oficinapro WITH ENCRYPTED PASSWORD 'senha-super-segura';
GRANT ALL PRIVILEGES ON DATABASE oficina_pro_db TO oficinapro;
\q
```

### 3. Deploy da Aplicação

```bash
# Criar diretório
sudo mkdir -p /var/www/oficina-pro-backend
cd /var/www/oficina-pro-backend

# Clonar repositório
sudo git clone <repo> .

# Instalar dependências
npm ci --only=production

# Criar .env
sudo nano .env
# Configurar variáveis (DATABASE_URL, JWT_SECRET, etc.)

# Gerar Prisma Client
npx prisma generate

# Rodar migrações
npx prisma migrate deploy

# Build
npm run build

# Iniciar com PM2
pm2 start dist/server.js --name oficina-pro-backend
pm2 save
pm2 startup
```

### 4. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/oficina-pro
```

```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/oficina-pro /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 5. SSL com Let's Encrypt (Certbot)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d api.seudominio.com

# Auto-renovar (já configurado automaticamente)
sudo certbot renew --dry-run
```

---

## ☁️ Opção 3: AWS

### Usando EC2 + RDS

#### 1. Criar RDS (PostgreSQL)

1. Acessar AWS Console
2. RDS → Create Database
3. PostgreSQL 15
4. Free tier / Configuração desejada
5. Anotar endpoint

#### 2. Criar EC2

1. EC2 → Launch Instance
2. Ubuntu Server 22.04
3. t2.micro (free tier) ou maior
4. Security Group: Permitir portas 22, 80, 443
5. Conectar e seguir passos da "Opção 2 - VPS"

#### 3. Configurar DATABASE_URL

```env
DATABASE_URL="postgresql://user:password@rds-endpoint:5432/dbname"
```

### Usando Elastic Beanstalk

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init

# Criar ambiente
eb create oficina-pro-backend-prod

# Configurar variáveis
eb setenv DATABASE_URL="..." JWT_SECRET="..."

# Deploy
eb deploy
```

---

## 🌐 Opção 4: Render.com (Mais Fácil)

### 1. Criar Conta

- Acessar [render.com](https://render.com)
- Conectar GitHub

### 2. Criar PostgreSQL

1. New → PostgreSQL
2. Nome: `oficina-pro-db`
3. Free tier
4. Copiar Internal Database URL

### 3. Criar Web Service

1. New → Web Service
2. Conectar repositório
3. Configurar:
   - **Name**: oficina-pro-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`

### 4. Environment Variables

```
NODE_ENV=production
DATABASE_URL=<internal-database-url>
JWT_SECRET=<gerar-random-32-chars>
JWT_REFRESH_SECRET=<gerar-random-32-chars>
CORS_ORIGIN=https://seu-frontend.com
```

### 5. Deploy

- Render fará deploy automaticamente
- A cada push no GitHub, redeploy automático

---

## ⚙️ Variáveis de Ambiente Obrigatórias

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=<min-32-caracteres>
JWT_REFRESH_SECRET=<min-32-caracteres>
CORS_ORIGIN=https://seu-frontend.com
```

---

## ✅ Checklist de Deploy

### Antes do Deploy

- [ ] Testar localmente
- [ ] Rodar `npm run build` sem erros
- [ ] Testar migrações: `npx prisma migrate deploy`
- [ ] Configurar variáveis de ambiente
- [ ] Gerar JWT secrets seguros (32+ caracteres aleatórios)
- [ ] Configurar CORS_ORIGIN correto

### Durante o Deploy

- [ ] Rodar migrações no banco de produção
- [ ] Verificar logs: `pm2 logs` ou `docker logs`
- [ ] Testar endpoint: `/health`
- [ ] Criar primeiro usuário admin

### Após o Deploy

- [ ] Monitorar logs
- [ ] Configurar backups do banco
- [ ] Configurar SSL/HTTPS
- [ ] Testar endpoints principais
- [ ] Monitorar performance

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL

# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql
```

### Erro: "Port 3001 already in use"

```bash
# Encontrar processo
lsof -i :3001

# Matar processo
kill -9 <PID>

# Ou usar outra porta
PORT=3002 npm start
```

### Erro: "Prisma Client not generated"

```bash
npx prisma generate
```

### PM2 Não Inicia Automaticamente

```bash
pm2 startup
pm2 save
```

---

## 📊 Monitoramento

### Logs com PM2

```bash
pm2 logs oficina-pro-backend
pm2 monit
```

### Métricas

```bash
pm2 plus  # Criar conta em pm2.io
pm2 link <public-key> <secret-key>
```

### Health Check

```bash
curl http://localhost:3001/health
```

---

## 🔄 Atualizações

```bash
# Com PM2
cd /var/www/oficina-pro-backend
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart oficina-pro-backend

# Com Docker
docker-compose down
git pull
docker-compose build
docker-compose up -d
```

---

## 🔒 Segurança

### Boas Práticas

1. **JWT Secrets**: Usar geradores aleatórios
2. **HTTPS**: Sempre usar SSL em produção
3. **CORS**: Configurar origin específico
4. **Rate Limiting**: Configurado por padrão
5. **Helmet**: Já ativo
6. **Passwords**: Sempre com bcrypt
7. **SQL Injection**: Prisma protege automaticamente
8. **Backups**: Agendar backups diários do DB

---

## 📞 Suporte

Em caso de problemas:

1. Verificar logs
2. Consultar documentação
3. GitHub Issues
4. Email: hiraokagabriel@gmail.com

---

**Boa sorte com o deploy! 🚀**
