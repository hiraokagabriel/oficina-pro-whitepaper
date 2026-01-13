# 👋 Guia de Contribuição - ERP Oficina PRO

Obrigado por se interessar em contribuir! Este documento explica como participar do projeto.

## 🤘 Código de Conduta

Todos os contribuidores devem seguir nosso código de conduta:

- ✅ Seja respeitoso com todos
- ✅ Seja aberto a críticas construtivas
- ✅ Se concentre no que é melhor para a comunidade
- ✅ Mostre empatia com outros contribuidores

**Violáções** podem resultar em banimento do projeto.

---

## 📚 Antes de Começar

### Leia a Documentação

1. [README.md](./README.md) - Visão geral
2. [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Design interno
3. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Atalhos para devs
4. [ROADMAP.md](./ROADMAP.md) - Planos futuros

### Setup do Ambiente

```bash
# 1. Fork o repositório
# Ir para https://github.com/hiraokagabriel/oficina-pro-whitepaper
# Clicar em "Fork"

# 2. Clone seu fork
git clone https://github.com/SEU_USERNAME/oficina-pro-whitepaper.git
cd oficina-pro-whitepaper

# 3. Adicionar upstream
git remote add upstream https://github.com/hiraokagabriel/oficina-pro-whitepaper.git

# 4. Instalar dependencias
npm install
cd src-tauri && cargo build && cd ..

# 5. Rodar em dev
npm tauri dev
```

---

## 📧 Tipos de Contribuição

### 1. Bug Report

**Encontrou um bug? Abra uma issue!**

```markdown
## Descrição
Ao clicar "Salvar OS", recebo erro.

## Passos para Reproduzir
1. Abrir modal OSModal
2. Digitar nome do cliente
3. Clicar "Salvar"

## Comportamento Esperado
OS deve ser salva sem erro

## Comportamento Atual
Recebo mensagem: "Erro ao salvar"

## Ambiente
- OS: Windows 11
- Versão: 1.0-rc1
- Navegador: Tauri

## Screenshot
[Anexe screenshot do erro]
```

### 2. Feature Request

**Tem uma ideia? Sugira uma feature!**

```markdown
## Descrição da Feature
Gostaria de poder exportar OS como PDF.

## Motivação
Poder enviar OS por email facilita comunicação com cliente.

## Solução Proposta
1. Botão "Exportar como PDF" no menu da OS
2. Usar biblioteca como pdfkit ou similar
3. Abrir diálogo de save

## Contexto Adicional
[Qualquer outra informação relevante]
```

### 3. Pull Request (Código)

**Quer contribuir com código? Excelente!**

#### Passo 1: Abra uma Issue Primeiro

```bash
# Discuta sua ideia ANTES de codificar
# Assim evitamos rejeitar PR que não se encaixa

# Create issue: "Adicionar export para PDF"
# Espere feedback: "Boa ideia! Vamos fazer assim..."
```

#### Passo 2: Crie uma Branch

```bash
# Update upstream
git fetch upstream
git rebase upstream/main

# Create branch
git checkout -b feature/export-pdf

# Branch naming:
#   feature/xxx     - Nova funcionalidade
#   fix/xxx         - Correção de bug
#   refactor/xxx    - Refatoração
#   docs/xxx        - Documentação
#   perf/xxx        - Otimização de performance
```

#### Passo 3: Implemente

```bash
# Faça mudancas
# Commit regularmente
git add .
git commit -m "feat: implementar export PDF"

# Seguir padrão de commit message
```

#### Passo 4: Teste

```bash
# Testar localmente
npm tauri dev

# Executar linter
npm run lint

# Executar type check
npm run type-check

# Nenhum console.log() ou debugger
# Formatar código
npx prettier --write src/
```

#### Passo 5: Push e PR

```bash
# Push para seu fork
git push origin feature/export-pdf

# Abrir PR em https://github.com/hiraokagabriel/oficina-pro-whitepaper/pulls
# Usar template de PR
```

**PR Template:**

```markdown
## Descrição
Implementei funcionalidade de export para PDF.

## Tipo de Mudança
- [ ] Bug fix
- [x] New feature
- [ ] Breaking change
- [ ] Documentation

## Linked Issue
Fixes #42

## Como Testar
1. Abrir modal OSModal
2. Clicar em "Exportar PDF"
3. Salvar arquivo

## Checklist
- [x] Código segue style guide
- [x] Auto-review do meu código
- [x] Comentei mudancas complexas
- [x] Atualizei documentação
- [x] Nenhum novo warning
- [x] Testes adicionados
- [x] Testes passam localmente

## Screenshots (se aplicável)
[Adicione antes/depois]
```

### 4. Documentação

**Melhorar documentação é muito valioso!**

```bash
# Corrigir typo
git checkout -b docs/fix-typo-readme
# Editar README.md
git commit -m "docs: corrigir typo em README"
git push origin docs/fix-typo-readme
# Abrir PR
```

---

## 📤 Commit Messages

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Exemplos

```bash
# Feature simples
git commit -m "feat: adicionar botao de export PDF"

# Feature com scope
git commit -m "feat(OSModal): implementar autocomplete de clientes"

# Bug fix
git commit -m "fix: corrigir cálculo de total em WorkOrder"

# Com body (mudancá complexa)
git commit -m "refactor: simplificar lógica de cascata

Anterior: Atualiza cliente → busca todas OS → atualiza uma por uma
Novo: Usa upsert em batch (mais rápido)

Melhoria de performance: 90% mais rápido"

# Com issue link
git commit -m "fix: corrigir typo em validador

Fixes #123"
```

### Tipos de Commit

- `feat`:     Nova funcionalidade
- `fix`:      Correção de bug
- `refactor`: Reorganização de código
- `perf`:     Otimização de performance
- `docs`:     Alteração de documentação
- `style`:    Formatação, typos (sem mudanca lógica)
- `test`:     Adiciona testes
- `chore`:    Atualiza dependências, build config

---

## 👿 Revisação de Código

### O que Esperamos

✅ **Ser aceito:**
- Código limpo e legvel
- Segue estilo do projeto
- Resolves issue claramente
- Testes adicionados
- Documentação atualizada

❌ **Ser rejeitado:**
- Quebra testes existentes
- Não segue estilo do projeto
- Falta de contexto/descrição
- Mudanças não relacionadas
- Breaking changes sem discussão

### Feedback

Quando seu PR recebe feedback:

```bash
# Fazer as mudanças
# Commitar (não rebasear - mantemos histórico)
git add .
git commit -m "refactor: address review feedback"

# Push
git push origin feature/export-pdf

# GitHub atualiza automaticamente a PR
```

**Não se sinta desapontado com feedback negativo!** É parte do processo de melhoria.

---

## 🎆 Casos Especiais

### Adicionar Novo Comando Tauri

```rust
// src-tauri/src/main.rs

#[tauri::command]
pub async fn meu_novo_comando(
    parametro: String,
) -> Result<String, String> {
    // lógica aqui
    Ok("resultado".to_string())
}

// Registrar no builder
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        save_database,
        meu_novo_comando, // ← adicionar aqui
    ])
```

```typescript
// src/context/DatabaseContext.tsx

const resultado = await invoke('meu_novo_comando', {
  parametro: 'valor',
});
```

### Adicionar Novo Hook

```typescript
// src/hooks/useMeuHook.ts

export function useMeuHook(dados: any[]) {
  return useMemo(() => {
    // Processamento
    return processado;
  }, [dados]);
}

// Usar em componente
export function MeuComponente() {
  const processado = useMeuHook(dados);
  return <div>{processado}</div>;
}
```

### Adicionar Nova Página

```typescript
// src/pages/NovaPage.tsx

export function NovaPage() {
  return <div>Página nova</div>;
}

// src/App.tsx

const NovaPage = lazy(() => import('./pages/NovaPage'));

// No render
{tab === 'nova' && <Suspense><NovaPage /></Suspense>}
```

---

## 🌟 Perguntas?

- Abra uma [Discussion](https://github.com/hiraokagabriel/oficina-pro-whitepaper/discussions)
- Entre em contato: hiraokagabriel@gmail.com
- Verifique issues e PRs existentes primeiro!

---

## 🏆 Reconhecimento

Todos os contribuidores serão creditados em:
- [CONTRIBUTORS.md](./CONTRIBUTORS.md) (futuro)
- Release notes de cada versão
- GitHub contributors page

---

**Obrigado por contribuir! 🚀**
