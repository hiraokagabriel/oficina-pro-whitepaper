# 📖 Guia de Uso - Oficina PRO ERP

## Sumário

1. [Introdução](#introdução)
2. [Navegação Principal](#navegação-principal)
3. [Módulo de Ordens de Serviço](#módulo-de-ordens-de-serviço)
4. [Módulo de Clientes](#módulo-de-clientes)
5. [Módulo Financeiro](#módulo-financeiro)
6. [Atalhos de Teclado](#atalhos-de-teclado)
7. [Dicas e Boas Práticas](#dicas-e-boas-práticas)

---

## Introdução

Oficula PRO ERP é um sistema completo de gestão para oficinas mecânicas, permitindo:

✅ Gerenciamento de ordens de serviço com Kanban
✅ Cadastro e gestão de clientes
✅ Controle financeiro de receitas e despesas
✅ Cálculo automático de valores
✅ Relatórios e exportação de dados
✅ Interface responsiva e intuitiva

---

## Navegação Principal

### Abas Principais

A navegação está organizada em 4 abas principais:

**📋 Ordens de Serviço**
- Visualizar todas as O.S. em andamento
- Arrastar cards entre colunas (Kanban)
- Editar e finalizar ordens

**👥 Clientes**
- Cadastrar novos clientes
- Editar dados de contato
- Visualizar histórico de serviços

**💰 Financeiro**
- Dashboard com resumo financeiro
- Lançar receitas e despesas
- Gerar relatórios mensais

**⚙️ Configurações**
- Ajustes do sistema
- Preferências de usuário
- Backup de dados

---

## Módulo de Ordens de Serviço

### Criando uma Nova O.S.

1. Clique no botão **"+ Nova O.S."** no topo
2. Selecione o cliente ou crie um novo
3. Descreva o veículo (ex: "Fiat Uno 2010 prata")
4. Adicione itens (serviços e peças)
5. Deixe notas públicas (visíveis na impressão) ou internas
6. Clique em **"Criar"**

### Estados de uma O.S.

| Estado | Descrição | Cor |
|--------|-----------|-----|
| **Orçamento** | Aguardando aprovação do cliente | Roxo |
| **Aprovado** | Cliente aprovou, pronto para iniciar | Azul |
| **Em Serviço** | Serviço em andamento | Laranja |
| **Finalizado** | Serviço concluído, pronto para faturamento | Verde |
| **Arquivado** | O.S. fechada e arquivada | Cinza |

### Adicionando Itens

**Tipo de Item:**
- **Serviço**: Mão-de-obra (ex: "Revisão de freios")
- **Peça**: Componentes (ex: "Pastilha de freio traseira")

**Campos:**
- Descrição
- Quantidade
- Preço unitário
- **Total** (calculado automaticamente)

---

## Módulo de Clientes

### Cadastrando um Cliente

1. Vá para a aba **Clientes**
2. Clique em **"+ Novo Cliente"**
3. Preencha os campos:
   - **Nome** (obrigatório)
   - **Telefone** (obrigatório, formato automático)
   - **Email** (opcional)
   - **CPF** (opcional)
   - **Notas** (opcional)
4. Clique em **"Criar"**

### Gerenciando Clientes

- **Editar**: Clique no botão "Editar" da linha do cliente
- **Deletar**: Clique no botão "Deletar" (com confirmação)
- **Buscar**: Use a funcionalidade de busca (em desenvolvimento)

### Visualizando Histórico

O sistema rastreia automaticamente:
- Total de O.S. do cliente
- Valor total gasto
- Última data de serviço
- Contato de preferência

---

## Módulo Financeiro

### Dashboard Financeiro

Visualiza em tempo real:
- **Receita**: Total de entradas do período
- **Despesa**: Total de saídas do período
- **Saldo do Mês**: Diferença entre receita e despesa
- **Saldo Total**: Acumulado histórico

### Lançando Receitas e Despesas

1. Clique em **"+ Novo Lançamento"**
2. Selecione o tipo:
   - **Receita**: Dinheiro que entra
   - **Despesa**: Dinheiro que sai
3. Preencha:
   - Descrição (ex: "Serviço de alinhamento")
   - Valor
   - Data
   - Categoria (opcional)
   - Vincular à O.S. (opcional)
4. Se parcelado, configure o número de parcelas
5. Clique em **"Criar"**

### Filtros de Período

- Selecione mês e ano no topo do dashboard
- Visualize dados específicos de cada período
- Histórico completo fica disponível

### Relatórios

**Dados disponíveis:**
- Receita mensal vs. anual
- Despesa por categoria
- Comparativo de períodos
- Tendências financeiras

---

## Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `Ctrl + N` | Nova O.S. |
| `Ctrl + E` | Exportar dados |
| `Ctrl + P` | Imprimir |
| `Esc` | Fechar modal |
| `Tab` | Navegar entre campos |

---

## Dicas e Boas Práticas

### 📊 Organização de O.S.

1. **Use nomes descritivos** para clientes
2. **Adicione notas públicas** importantes visíveis ao cliente
3. **Mantenha categorias consistentes** de serviços
4. **Revise O.S. antigos** mensalmente

### 💰 Gestão Financeira

1. **Lance receitas no mesmo dia** do faturamento
2. **Categorize despesas** para melhor rastreamento
3. **Revise relatórios mensalmente** para tendências
4. **Faça backup regular** dos dados

### 🔧 Manutenção do Sistema

1. **Limpe dados antigos** periodicamente
2. **Atualize informações** de clientes regularmente
3. **Verifique cálculos** de totais periodicamente
4. **Exporte dados** como backup

### 📱 No Celular/Tablet

- Interface totalmente responsiva
- Toque e arraste para mover cards
- Pinch-zoom para maior legibilidade
- Salva automaticamente em todos os dispositivos (ao conectar conta)

---

## Resolução de Problemas

### O.S. não aparece na tela

1. Verifique o filtro de mês/ano
2. Certifique-se de que o cliente está cadastrado
3. Recarregue a página

### Dados desapareceram

1. Verifique o histórico de navegação
2. Faça backup regular (menu de configurações)
3. Considere versões anteriores (se disponível)

### Cálculos incorretos

1. Verifique valores dos itens
2. Confirme quantidade vs. preço unitário
3. Recarregue a página para recalcular

---

## Contacto e Suporte

**Desenvolvedor**: Gabriel Hiraoka
**Email**: hiraokagabriel@gmail.com
**GitHub**: github.com/hiraokagabriel/oficina-pro-whitepaper

---

**Versão**: 1.0.0
**Última atualização**: 13 de janeiro de 2026
**Status**: ✅ Completo e funcional
