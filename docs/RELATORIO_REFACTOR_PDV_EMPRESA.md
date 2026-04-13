# Relatório: Refatoração PDV e Módulos Operacionais por Empresa

**Data:** 2026-04-13

## Análise Técnica

### Problema
Os módulos operacionais (Clientes, Produtos, Fornecedores, Transportadoras, Notas Fiscais) dependem de `company_id` — pertencem ao contexto da empresa, não ao contador. Mantê-los no menu do contador gera ambiguidade, risco de mistura de dados e necessidade de seletor de empresa.

### Decisão: Concentrar no contexto da empresa ✅
- **Contador** → visão estratégica (carteira, cobranças, certificados, relatórios)
- **Empresa (via Acessar)** → visão operacional (clientes, produtos, vendas, NF)
- Isolamento natural por `company_id` via RLS
- Zero risco de dados cruzados entre empresas

## Novas Tabelas Criadas

### suppliers
| Campo | Tipo | Descrição |
|-------|------|-----------|
| company_id | uuid | FK → companies |
| nome | text | Nome do fornecedor |
| cpf_cnpj | text | CPF/CNPJ |
| email, telefone, endereco, cidade, uf | text | Dados cadastrais |

### carriers
| Campo | Tipo | Descrição |
|-------|------|-----------|
| company_id | uuid | FK → companies |
| nome | text | Nome da transportadora |
| cpf_cnpj | text | CPF/CNPJ |
| antt | text | Registro ANTT |
| placa | text | Placa do veículo |
| uf | text | UF |

### sales
| Campo | Tipo | Descrição |
|-------|------|-----------|
| company_id | uuid | FK → companies |
| customer_id | uuid | FK → customers (opcional) |
| numero | serial | Numeração automática |
| status | text | rascunho / finalizada / faturada / cancelada |
| subtotal, desconto, total | numeric | Valores financeiros |
| forma_pagamento | text | Forma de pagamento |
| observacoes | text | Observações |

### sale_items
| Campo | Tipo | Descrição |
|-------|------|-----------|
| sale_id | uuid | FK → sales |
| product_id | uuid | FK → products (opcional) |
| nome_produto | text | Nome snapshot |
| quantidade | numeric | Quantidade |
| preco_unitario | numeric | Preço unitário |
| desconto | numeric | Desconto por item |
| subtotal | numeric | Subtotal do item |

## RLS (Row Level Security)
Todas as 4 tabelas possuem 3 policies idênticas:
1. **Admin** → acesso total
2. **Contador** → via join companies→accountants (user_id = auth.uid)
3. **Emissor** → via join companies (user_id = auth.uid)

## Fluxo PDV → Nota Fiscal

```
1. Empresa acessa PDV / Vendas
2. Cria nova venda → seleciona cliente + produtos
3. Salva como "rascunho"
4. Finaliza a venda → status "finalizada"
5. Na emissão fiscal, seleciona venda finalizada
6. Dados preenchidos automaticamente (cliente, produtos, valores)
7. Emite NF → venda vira "faturada"
```

### Status da Venda
| Status | Descrição | Pode emitir NF? |
|--------|-----------|----------------|
| rascunho | Em edição | Não |
| finalizada | Pronta para faturar | Sim |
| faturada | NF emitida | Não (já emitida) |
| cancelada | Cancelada | Não |

## Menu Final

### Contador (estratégico)
- Dashboard
- Empresas
- Cobranças Empresas
- Mensalidades
- Certificados A1
- Cobrança PIX
- Relatórios
- Configurações

### Empresa / Emissor (operacional)
- Dashboard
- Clientes
- Produtos
- Fornecedores
- Transportadoras
- PDV / Vendas
- Notas Fiscais (NF-e Entrada, Saída, Devolução, NFC-e)
- Mensalidades
- Relatórios
- Configurações

## Arquivos Alterados

| Arquivo | Alteração |
|---------|-----------|
| `src/components/dashboard/DashboardLayout.tsx` | Adicionado menu PDV/Vendas para emissor, importado ShoppingCart |
| `src/App.tsx` | Adicionada rota `/dashboard/vendas` com VendasPage |
| `src/pages/dashboard/VendasPage.tsx` | **NOVO** — Página completa de PDV/Vendas |

## Garantias de Segurança
- Todos os dados filtrados por `company_id`
- RLS ativo em todas as tabelas
- Sem listagem global — sempre contextual
- Contador acessa operação apenas via impersonação
- Empresa vê apenas seus próprios dados
