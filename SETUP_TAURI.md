# Setup Tauri - Backend Integration

## Pré-requisitos

### 1. Instalar Rust

#### Windows
```bash
# Baixar de: https://www.rust-lang.org/tools/install
# Ou usar:
choco install rust
```

#### macOS
```bash
brew install rust
```

#### Linux (Ubuntu/Debian)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Instalar Node.js 18+
```bash
node --version  # v18.0.0 ou superior
npm --version   # 8.0.0 ou superior
```

### 3. Instalar Tauri CLI
```bash
# Opção 1: via npm (recomendado)
npm install -g @tauri-apps/cli

# Opção 2: via cargo
cargo install tauri-cli --locked
```

## Estrutura Tauri

O projeto Tauri será estruturado assim:

```
officina-erp/
├── src/                    # Frontend React (já existente)
├── src-tauri/              # Backend Rust (a criar)
│   ├── Cargo.toml         # Dependências Rust
│   ├── src/
│   │   └── main.rs        # Entry point Tauri
│   └── tauri.conf.json    # Configuração Tauri
├── public/                 # Assets estáticos
├── package.json           # Frontend deps
├── vite.config.ts         # Config Vite
└── tsconfig.json          # Config TypeScript
```

## Instalação Passo a Passo

### 1. Instalar Dependências Frontend
```bash
cd oficina-erp
npm install
```

### 2. Instalar Tauri
```bash
# Atualizar npm
npm install -g npm@latest

# Instalar Tauri
npm install --save-dev @tauri-apps/cli @tauri-apps/api
```

### 3. Criar Estrutura Tauri
```bash
# Usar o template do Tauri
npm run tauri init

# Escolher as opções:
# Package name: oficina-erp
# Window title: Oficina PRO
# UI dev server URL: http://localhost:5173
# Frontend build dir: ../dist
# Frontend build command: npm run build
# Frontend dev command: npm run dev
```

### 4. Atualizar Cargo.toml

Editar `src-tauri/Cargo.toml` e adicionar dependeências:

```toml
[dependencies]
tauri = { version = "1.5.0", features = ["shell-open"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
sqlite = "0.30"
chrono = "0.4"
uuid = { version = "1.0", features = ["v4", "serde"] }
```

### 5. Atualizar scripts package.json

```json
{
  "scripts": {
    "dev": "tauri dev",
    "build": "tauri build",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write src",
    "preview": "vite preview",
    "tauri": "tauri"
  }
}
```

## Executar em Desenvolvimento

### Terminal 1: Frontend dev server (opcional)
```bash
npm run dev:vite
```

### Terminal 2: Tauri dev
```bash
npm run dev
```

Isso abrirá a janela do desktop com hot reload.

## Estrutura do Backend (main.rs)

```rust
// src-tauri/src/main.rs

#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use tauri::Manager;
use std::fs;
use serde_json::{json, Value};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_database,
            load_database,
            create_backup,
            restore_backup,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Exemplo de comando
#[tauri::command]
fn save_database(data: String) -> Result<String, String> {
    // Salvar JSON em arquivo
    match fs::write("data.json", &data) {
        Ok(_) => Ok("Salvo com sucesso".to_string()),
        Err(e) => Err(format!("Erro ao salvar: {}", e)),
    }
}

#[tauri::command]
fn load_database() -> Result<String, String> {
    // Carregar JSON do arquivo
    match fs::read_to_string("data.json") {
        Ok(data) => Ok(data),
        Err(e) => Err(format!("Erro ao carregar: {}", e)),
    }
}
```

## Invocar Comandos do Frontend

Exemplo em React:

```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Invocar comando Rust
const result = await invoke('save_database', {
    data: JSON.stringify(database)
});
```

## Build para Produção

### macOS
```bash
npm run build
```
Gera: `src-tauri/target/release/bundle/macos/Oficina PRO.app`

### Windows
```bash
npm run build
```
Gera: `src-tauri/target/release/Oficina PRO.exe`

### Linux
```bash
npm run build
```
Gera: `src-tauri/target/release/bundle/deb/oficina-erp_*.deb`

## Troubleshooting

### Erro: "Tauri not found"
```bash
npm install -g @tauri-apps/cli
```

### Erro: "Rust toolchain not found"
```bash
rustup update
rustup component add rust-std-x86_64-unknown-linux-gnu
```

### Erro: "Command failed: npm run build"
1. Verificar que `npm run build` funciona
2. Verificar caminhos em `tauri.conf.json`
3. Limpar dist: `rm -rf dist`

## Recursos

- [Tauri Docs](https://tauri.app/)
- [Tauri API](https://tauri.app/api/js/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [SQLite Rust](https://crates.io/crates/sqlite)

## Próximos Passos

1. [x] Setup básico do projeto
2. [ ] Implementar database persistence
3. [ ] Criar comandos Rust para CRUD
4. [ ] Implementar backup automático
5. [ ] Adicionar sincronização cloud
