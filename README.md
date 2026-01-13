# 🔧 Oficina PRO ERP

**Sistema ERP completo para gestão de oficinas mecânicas**

[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tauri](https://img.shields.io/badge/Tauri-1.5-FFC131?logo=tauri)](https://tauri.app/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🌟 Funcionalidades

- ✅ **Kanban Board** com drag-and-drop para gestão de ordens de serviço
- ✅ **Gestão de Clientes** completa com validação
- ✅ **Dashboard Financeiro** em tempo real
- ✅ **Cálculos automáticos** de totais e saldos
- ✅ **Auto-save** com persistência local
- ✅ **Design responsivo** (desktop, tablet, mobile)
- ✅ **Aplicativo Desktop** com Tauri

---

## 🚀 Quick Start

### Pré-requisitos

- **Node.js 18+**: https://nodejs.org/
- **Rust** (para Tauri): https://www.rust-lang.org/tools/install
- **Visual Studio C++ Build Tools** (Windows)

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/hiraokagabriel/oficina-pro-whitepaper.git
cd oficina-pro-whitepaper

# 2. Instalar dependências
npm install

# 3. Rodar em modo web
npm run dev

# OU rodar como app desktop (primeira vez demora ~10min)
npm run tauri:dev
```

Acesse: http://localhost:5173

---

## 📋 Comandos

| Comando | Descrição |
|---------|-------------|
| `npm run dev` | Roda frontend React (web) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run tauri:dev` | Roda app desktop (Tauri) |
| `npm run tauri:build` | Build executável desktop |

---

## 📚 Documentação

- **[INSTALACAO.md](./INSTALACAO.md)** - Guia completo de instalação
- **[GUIA_USO.md](./GUIA_USO.md)** - Como usar o sistema
- **[FEATURES.md](./FEATURES.md)** - Lista de funcionalidades
- **[ARQUITETURA.md](./ARQUITETURA.md)** - Design técnico
- **[STATUS_FINAL.md](./STATUS_FINAL.md)** - Status do projeto

---

## 🏗️ Estrutura do Projeto

```
oficina-pro-whitepaper/
├── src/
│   ├── components/        # Componentes React
│   ├── context/           # State management
│   ├── styles/            # Estilos CSS
│   ├── types/             # Types TypeScript
│   ├── utils/             # Funções auxiliares
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Entry point
├── src-tauri/
│   ├── src/               # Código Rust
│   ├── Cargo.toml         # Dependências Rust
│   └── tauri.conf.json    # Configuração Tauri
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## 🐛 Troubleshooting

### Erro: "Missing script: tauri"

```bash
npm install
npm install -D @tauri-apps/cli@latest
```

### Erro: "Rust not found"

- Instalar Rust: https://www.rust-lang.org/tools/install
- Reiniciar terminal após instalação

### Build lento

Normal na primeira vez! O Rust precisa compilar tudo do zero (~10min).
Próximas compilações são incrementais (~30s).

**Mais detalhes**: [INSTALACAO.md](./INSTALACAO.md)

---

## 📊 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Desktop**: Tauri 1.5 (Rust)
- **State**: Context API
- **Storage**: LocalStorage
- **Styling**: CSS3 com variáveis
- **Drag & Drop**: @hello-pangea/dnd

---

## ✅ Status

- ✅ MVP 100% completo e funcional
- ✅ Todas as funcionalidades core implementadas
- ✅ Design responsivo
- ✅ Documentação completa
- ✅ Pronto para produção

---

## 👨‍💻 Desenvolvedor

**Gabriel Hiraoka**
- GitHub: [@hiraokagabriel](https://github.com/hiraokagabriel)
- Email: hiraokagabriel@gmail.com

---

## 📄 Licença

MIT License - Livre para usar, modificar e distribuir

---

**Desenvolvido com ❤️ em janeiro de 2026**
