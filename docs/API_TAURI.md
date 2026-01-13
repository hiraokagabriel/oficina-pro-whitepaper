# 🚀 API Tauri IPC - ERP Oficina PRO

## Índice

1. [Visão Geral](#visão-geral)
2. [Comandos Disponíveis](#comandos-disponíveis)
3. [Exemplos de Uso](#exemplos-de-uso)
4. [Tratamento de Erros](#tratamento-de-erros)
5. [Performance e Limites](#performance-e-limites)

---

## Visão Geral

### O que é Tauri IPC?

IPC = Inter-Process Communication. É a forma como o React (Frontend) se comunica com o Rust (Backend).

```
React (Process 1)  →  Bridge JSON  →  Rust (Process 2)
  invoke()            (Serializado)      Receives & Executes
  ←←←←  Promise Resolve/Reject  ←←←←
```

### Configuração

**Backend (src-tauri/src/main.rs):**
```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_database,
            load_database,
            export_csv,
            upload_backup,
            // ... mais comandos
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**Frontend (src/context/DatabaseContext.tsx):**
```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Usar assim:
await invoke('save_database', { data: jsonString });
```

---

## Comandos Disponíveis

### 1. `save_database`

**Propósito:** Salvar estado completo da aplicação no disco.

**Assinatura Rust:**
```rust
#[tauri::command]
pub async fn save_database(
    data: String,  // JSON serializado
    app_handle: tauri::AppHandle,
) -> Result<String, String>
```

**Uso Frontend:**
```typescript
try {
  const result = await invoke('save_database', {
    data: JSON.stringify({
      workOrders: state.workOrders,
      ledger: state.ledger,
      clients: state.clients,
      settings: state.settings,
    }),
  });
  
  console.log('Saved:', result); // "Saved successfully"
} catch (error) {
  console.error('Save failed:', error);
  showToast('error', 'Erro ao salvar');
}
```

**Código Rust Completo:**
```rust
#[tauri::command]
pub async fn save_database(
    data: String,
    app_handle: tauri::AppHandle,
) -> Result<String, String> {
    let json_path = app_handle
        .path_resolver()
        .app_local_data_dir()
        .ok_or("Failed to resolve path".to_string())?
        .join("database.json");
    
    std::fs::write(&json_path, &data)
        .map_err(|e| format!("IO error: {}", e))?;
    
    // Opcional: validar JSON
    let _: serde_json::Value = serde_json::from_str(&data)
        .map_err(|e| format!("Invalid JSON: {}", e))?;
    
    Ok("Saved successfully".to_string())
}
```

**Limites:**
- Máximo: ~10MB (por IPC)
- Timeout: 30s (default Tauri)
- Frequência: Recomendado 1x por segundo (debounce)

---

### 2. `load_database`

**Propósito:** Carregar database.json do disco.

**Assinatura Rust:**
```rust
#[tauri::command]
pub async fn load_database(
    app_handle: tauri::AppHandle,
) -> Result<String, String>
```

**Uso Frontend:**
```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  (async () => {
    try {
      const json = await invoke('load_database') as string;
      const data = JSON.parse(json);
      
      setWorkOrders(data.workOrders || []);
      setLedger(data.ledger || []);
      setClients(data.clients || []);
      setSettings(data.settings || {});
    } catch (error) {
      console.error('Load failed:', error);
      showToast('error', 'Erro ao carregar dados');
      // Fallback: dados vazios
      initializeEmptyDatabase();
    } finally {
      setIsLoading(false);
    }
  })();
}, []); // Apenas na inicialização
```

**Código Rust:**
```rust
#[tauri::command]
pub async fn load_database(
    app_handle: tauri::AppHandle,
) -> Result<String, String> {
    let json_path = app_handle
        .path_resolver()
        .app_local_data_dir()
        .ok_or("Failed to resolve path".to_string())?
        .join("database.json");
    
    // Se não existir, retorna banco vazio
    if !json_path.exists() {
        return Ok(
            r#"{"version":"1.0","workOrders":[],"ledger":[],"clients":[]}"#
                .to_string()
        );
    }
    
    std::fs::read_to_string(&json_path)
        .map_err(|e| format!("Failed to read file: {}", e))
}
```

---

### 3. `export_csv`

**Propósito:** Exportar lançamentos financeiros para CSV.

**Assinatura:**
```rust
#[tauri::command]
pub async fn export_csv(
    entries: Vec<LedgerEntry>,
    filename: String,
    app_handle: tauri::AppHandle,
) -> Result<String, String>
```

**Uso:**
```typescript
const handleExportCSV = async () => {
  try {
    const result = await invoke('export_csv', {
      entries: ledger,
      filename: `relatorio_${new Date().toISOString().split('T')[0]}.csv`,
    });
    
    showToast('success', `Exportado: ${result}`);
  } catch (error) {
    showToast('error', 'Erro ao exportar');
  }
};
```

**Formato CSV:**
```
Data,Descrição,Tipo,Valor,Categoria
2026-01-13,Receita OS #001,RECEITA,150.00,Receita
2026-01-13,Combustivel,DESPESA,450.00,Combustivel
2026-02-01,Aluguel,DESPESA,2000.00,Aluguel
```

---

### 4. `upload_backup`

**Propósito:** Fazer upload do database.json para Google Drive.

**Assinatura:**
```rust
#[tauri::command]
pub async fn upload_backup(
    auth_token: String,
    data: String,
    app_handle: tauri::AppHandle,
) -> Result<BackupResult, String>

pub struct BackupResult {
    pub file_id: String,
    pub url: String,
    pub timestamp: String,
}
```

**Uso:**
```typescript
const handleBackupToGoogleDrive = async () => {
  try {
    setIsBackingUp(true);
    
    const token = await getGoogleAuthToken(); // Implementar OAuth
    
    const result = await invoke('upload_backup', {
      auth_token: token,
      data: JSON.stringify(database),
    });
    
    showToast('success', `Backup enviado! ID: ${result.file_id}`);
  } catch (error) {
    showToast('error', 'Erro ao fazer backup');
  } finally {
    setIsBackingUp(false);
  }
};
```

**Código Rust (Pseudocódigo):**
```rust
#[tauri::command]
pub async fn upload_backup(
    auth_token: String,
    data: String,
    app_handle: tauri::AppHandle,
) -> Result<BackupResult, String> {
    let client = reqwest::Client::new();
    
    let response = client
        .post("https://www.googleapis.com/upload/drive/v3/files")
        .header("Authorization", format!("Bearer {}", auth_token))
        .body(data)
        .send()
        .await
        .map_err(|e| format!("Upload failed: {}", e))?
        .json::<serde_json::Value>()
        .await
        .map_err(|e| format!("Parse error: {}", e))?;
    
    Ok(BackupResult {
        file_id: response["id"].as_str().unwrap_or("").to_string(),
        url: format!("https://drive.google.com/file/d/{}/view", response["id"]),
        timestamp: chrono::Local::now().to_rfc3339(),
    })
}
```

---

### 5. `print_order`

**Propósito:** Abrir diálogo de impressão nativa.

**Assinatura:**
```rust
#[tauri::command]
pub async fn print_order(
    html: String,
) -> Result<(), String>
```

**Nota:** Na verdade, usamos `window.print()` no JavaScript puro, não precisa de comando Tauri.

---

## Exemplos de Uso

### Exemplo 1: Auto-save com Debounce

```typescript
// hooks/useAutoSave.ts
export function useAutoSave(data: DatabaseState) {
  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    // Limpar timer anterior
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    
    // Agendar novo save em 1s
    saveTimerRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await invoke('save_database', {
          data: JSON.stringify(data),
        });
        showToast('success', 'Dados salvos!');
      } catch (error) {
        console.error('Save error:', error);
        showToast('error', 'Erro ao salvar');
      } finally {
        setIsSaving(false);
      }
    }, 1000);
    
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [data]);
  
  return { isSaving };
}
```

### Exemplo 2: Carregar Dados na Inicialização

```typescript
// App.tsx
useEffect(() => {
  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Carregar do disco
      const json = await invoke('load_database') as string;
      const database = JSON.parse(json);
      
      // Validar dados
      if (!database.version) {
        throw new Error('Database format invalid');
      }
      
      // Atualizar contexto
      setDatabase(database);
      
      showToast('info', 'Dados carregados com sucesso');
    } catch (error) {
      console.error('Init error:', error);
      showToast('error', 'Erro ao inicializar aplicativo');
      
      // Fallback: database vazio
      setDatabase(getEmptyDatabase());
    } finally {
      setIsLoading(false);
    }
  };
  
  initializeApp();
}, []);
```

### Exemplo 3: Exportar e Baixar CSV

```typescript
// pages/ConfigPage.tsx
const handleExportFinancial = async () => {
  try {
    const result = await invoke('export_csv', {
      entries: ledger,
      filename: `financeiro_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    
    // Resultado contém caminho do arquivo
    const message = `Arquivo exportado: ${result}`;
    console.log(message);
    showToast('success', message);
    
    // Opcional: abrir arquivo
    await invoke('open_file', { path: result });
  } catch (error) {
    showToast('error', `Erro na exportação: ${error}`);
  }
};
```

---

## Tratamento de Erros

### Estratégia de Retry

```typescript
interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
}

async function invokeWithRetry<T>(
  command: string,
  args: Record<string, any>,
  options: RetryOptions = {
    maxAttempts: 3,
    delayMs: 100,
    backoffMultiplier: 2,
  }
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await invoke<T>(command, args);
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed:`, error);
      
      if (attempt < options.maxAttempts) {
        const delay = options.delayMs * Math.pow(options.backoffMultiplier, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Uso
const result = await invokeWithRetry('save_database', {
  data: JSON.stringify(database),
});
```

### Categorização de Erros

```typescript
type ErrorCode = 
  | 'IO_ERROR'           // Erro no filesystem
  | 'INVALID_JSON'       // JSON mal formado
  | 'PERMISSION_DENIED'  // Sem permissão
  | 'NETWORK_ERROR'      // Erro de rede (backup)
  | 'TIMEOUT'            // Timeout da operação
  | 'UNKNOWN';           // Erro desconhecido

function categorizeError(error: string): ErrorCode {
  if (error.includes('Permission denied')) return 'PERMISSION_DENIED';
  if (error.includes('Invalid JSON')) return 'INVALID_JSON';
  if (error.includes('IO')) return 'IO_ERROR';
  if (error.includes('timeout')) return 'TIMEOUT';
  if (error.includes('Network')) return 'NETWORK_ERROR';
  return 'UNKNOWN';
}

const errorMessages: Record<ErrorCode, string> = {
  'IO_ERROR': 'Erro ao acessar o disco. Verifique permissões.',
  'INVALID_JSON': 'Arquivo corrompido. Restaure um backup.',
  'PERMISSION_DENIED': 'Sem permissão para acessar o diretório.',
  'NETWORK_ERROR': 'Erro de rede. Verifique sua conexão.',
  'TIMEOUT': 'Operação demorou muito. Tente novamente.',
  'UNKNOWN': 'Erro desconhecido. Entre em contato com suporte.',
};
```

---

## Performance e Limites

### Tamanho de Dados

```
Limite IPC: ~10MB por chamada

Size estimados:
- 100 OS: ~50KB
- 1000 OS: ~500KB
- 10000 OS: ~5MB
- 100000 OS: ~50MB (excede limite, precisa serialização em chunks)
```

### Timeouts

```rust
// Tauri default: 30s
// Para operações grandes, aumentar:

#[tauri::command]
pub async fn save_large_database(
    data: String,
    app_handle: tauri::AppHandle,
) -> Result<String, String> {
    tokio::time::timeout(
        Duration::from_secs(60), // 60s timeout
        async {
            // Operação aqui
            Ok("Done".to_string())
        }
    )
    .await
    .map_err(|_| "Operation timed out".to_string())?
}
```

### Otimizações

1. **Compressaão (Futuro)**
   ```typescript
   import { compress, decompress } from 'lz4';
   
   const compressedData = compress(JSON.stringify(data));
   await invoke('save_database', { data: compressedData });
   ```

2. **Serialização em Chunks**
   ```typescript
   const CHUNK_SIZE = 1024 * 1024; // 1MB
   
   for (let i = 0; i < data.length; i += CHUNK_SIZE) {
     const chunk = data.slice(i, i + CHUNK_SIZE);
     await invoke('save_database_chunk', {
       chunk,
       index: i / CHUNK_SIZE,
       total: Math.ceil(data.length / CHUNK_SIZE),
     });
   }
   ```

---

**Referência Oficial:** [Tauri Docs](https://tauri.app/)
