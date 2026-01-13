# 📦 GUIA DE INSTALAÇÃO - Oficina PRO ERP

## ⚠️ RESOLVENDO O ERRO "Missing script: tauri"

Se você recebeu o erro:
```
npm error Missing script: "tauri"
```

Siga os passos abaixo para instalar corretamente.

---

## 🔧 PRÉ-REQUISITOS

### Windows

**1. Node.js (versão 18 ou superior)**

- Download: https://nodejs.org/
- Verifique a instalação:
  ```bash
  node --version
  npm --version
  ```

**2. Rust (para Tauri)**

- Download: https://www.rust-lang.org/tools/install
- Ou use o instalador rustup-init.exe
- Verifique a instalação:
  ```bash
  rustc --version
  cargo --version
  ```

**3. Visual Studio C++ Build Tools**

- Download: https://visualstudio.microsoft.com/downloads/
- Instale "Desktop development with C++"
- Ou instale apenas o Build Tools:
  - https://visualstudio.microsoft.com/visual-cpp-build-tools/

**4. WebView2 (geralmente já instalado no Windows 10/11)**

- Se necessário: https://developer.microsoft.com/microsoft-edge/webview2/

---

## 📥 INSTALAÇÃO PASSO A PASSO

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/hiraokagabriel/oficina-pro-whitepaper.git
cd oficina-pro-whitepaper
```

### Passo 2: Instalar Dependências

```bash
npm install
```

Este comando irá:
- ✅ Instalar todas as dependências do React
- ✅ Instalar o CLI do Tauri
- ✅ Instalar dependências TypeScript

### Passo 3: Verificar Instalação

```bash
npm run tauri --version
```

Deve mostrar algo como:
```
tauri-cli 1.5.x
```

---

## 🚀 RODANDO O APLICATIVO

### Modo Desenvolvimento (Web)

Para rodar apenas o frontend React sem Tauri:

```bash
npm run dev
```

Abre em: http://localhost:5173

### Modo Desktop (Tauri)

Para rodar como aplicativo desktop:

```bash
npm run tauri:dev
```

**⏱️ Primeira Execução**: Pode levar 5-10 minutos para compilar o Rust

**Próximas Execuções**: ~30 segundos

---

## 🏗️ BUILD DE PRODUÇÃO

### Build Web

```bash
npm run build
npm run preview
```

### Build Desktop (Executável)

```bash
npm run tauri:build
```

O executável será gerado em:
```
src-tauri/target/release/oficina-pro-erp.exe
```

Ou instalador em:
```
src-tauri/target/release/bundle/
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Missing script: tauri"

**Solução:**
```bash
# 1. Reinstalar dependências
npm install

# 2. Verificar se @tauri-apps/cli está instalado
npm list @tauri-apps/cli

# 3. Se não estiver, instalar manualmente
npm install -D @tauri-apps/cli@latest
```

### Erro: "Rust not found"

**Solução:**
```bash
# Instalar Rust
winget install Rustlang.Rustup

# Ou baixar de: https://www.rust-lang.org/tools/install

# Após instalar, reiniciar o terminal
```

### Erro: "MSVC++ build tools not found"

**Solução:**
- Instalar Visual Studio Build Tools
- Incluir "Desktop development with C++"
- Link: https://visualstudio.microsoft.com/visual-cpp-build-tools/

### Erro: "WebView2 not found"

**Solução:**
- Baixar e instalar: https://developer.microsoft.com/microsoft-edge/webview2/
- Ou atualizar Windows 10/11

### Build lento na primeira vez

**Normal!** A primeira compilação do Rust demora porque precisa:
- Baixar dependências
- Compilar tudo do zero
- Gerar binários otimizados

Próximas compilações serão muito mais rápidas (incremental).

---

## 📋 COMANDOS DISPONÍVEIS

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Roda frontend React (web) |
| `npm run build` | Build de produção React |
| `npm run preview` | Preview do build |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run tauri:dev` | Roda app desktop (Tauri) |
| `npm run tauri:build` | Build executável desktop |
| `npm run tauri` | Executar comandos Tauri |

---

## 🎯 RECOMENDAÇÕES

### Para Desenvolvimento

1. **Use `npm run dev`** se quiser apenas testar a interface
2. **Use `npm run tauri:dev`** se precisar testar funcionalidades desktop
3. **Hot Reload**: Ambos suportam atualização automática

### Para Produção

1. **Web**: Use `npm run build` e hospede o conteúdo de `dist/`
2. **Desktop**: Use `npm run tauri:build` para gerar executável

---

## 💡 DICAS

### Acelerar compilação do Rust

Adicione ao `.cargo/config.toml`:
```toml
[build]
incremental = true

[profile.dev]
opt-level = 1
```

### Cache do NPM

Se tiver problemas, limpe o cache:
```bash
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

### Usar Yarn ao invés de NPM

```bash
yarn install
yarn tauri:dev
yarn tauri:build
```

---

## 📞 SUPORTE

Se continuar com problemas:

1. Verifique os logs em: `C:\Users\[seu-usuario]\AppData\Local\npm-cache\_logs`
2. Abra uma issue: https://github.com/hiraokagabriel/oficina-pro-whitepaper/issues
3. Email: hiraokagabriel@gmail.com

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [ ] Node.js instalado (versão 18+)
- [ ] Rust instalado
- [ ] Visual Studio Build Tools instalado
- [ ] WebView2 instalado (Windows)
- [ ] Git instalado
- [ ] Repositório clonado
- [ ] `npm install` executado com sucesso
- [ ] `npm run tauri --version` funciona
- [ ] `npm run dev` abre o app no navegador
- [ ] `npm run tauri:dev` abre o app desktop

---

**Última atualização**: 13 de janeiro de 2026
