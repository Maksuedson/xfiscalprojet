# Relatório — Melhoria Completa do Módulo PDV/Vendas

**Data:** 13/04/2026  
**Escopo:** Refatoração completa do `VendasPage.tsx`

---

## 1. O que foi melhorado

### Listagem de vendas
- Tabela profissional com colunas: Nº, Cliente, Data, Pagamento, Status, Subtotal, Desconto, Total, Ações
- Filtros por status, forma de pagamento e busca textual (número, cliente, CPF/CNPJ)
- Cards de estatísticas: total vendas, rascunhos, finalizadas, receita faturada
- Empty state contextual com orientação ao usuário

### Modal de nova venda
- Busca de cliente por nome ou CPF/CNPJ com filtro em tempo real
- Busca de produto por nome ou NCM com filtro em tempo real
- Edição inline de quantidade, valor unitário e desconto por item
- Desconto geral da venda
- Resumo financeiro com subtotal, descontos e total em tempo real
- Validações: item obrigatório, quantidade > 0, valor >= 0, total nunca negativo

### Modal de detalhe da venda
- Dados completos: cliente, CPF/CNPJ, data/hora, forma de pagamento, observações
- Tabela de itens com desconto individual
- Resumo financeiro com subtotal, desconto e total
- Ações contextuais por status (Finalizar, Cancelar, Emitir NF-e)

### Integração com dados reais
- Clientes: filtrados por `company_id` da empresa atual
- Produtos: filtrados por `company_id` da empresa atual
- Vendas: isoladas por `company_id`
- Itens de venda: vinculados à venda e ao produto

## 2. Arquivos alterados

| Arquivo | Alteração |
|---|---|
| `src/pages/dashboard/VendasPage.tsx` | Reescrita completa |

## 3. Tabelas utilizadas (sem alteração de schema)

- `sales` — vendas por empresa
- `sale_items` — itens de cada venda
- `customers` — clientes da empresa
- `products` — produtos da empresa

## 4. Regras de status

| Status | Pode editar | Pode faturar | Pode cancelar |
|---|---|---|---|
| Rascunho | Sim | Não | Sim |
| Finalizada | Não | Sim | Não |
| Faturada | Não | Não (já faturada) | Não |
| Cancelada | Não | Não | Não |

## 5. Regra de estoque (preparada)

- Rascunho: não baixa estoque
- Finalizada: não baixa definitivo
- Faturada: baixa estoque (a implementar com campo estoque no produto)
- Cancelada: sem efeito

## 6. Preparação para emissão fiscal

- Venda finalizada pode ser selecionada para emissão de NF-e
- Ao emitir, status muda para "faturada"
- Venda faturada não pode gerar nova nota
- Venda cancelada não pode ir para emissão

## 7. Isolamento e segurança

- Todos os dados filtrados por `company_id`
- RLS ativas em todas as tabelas envolvidas
- Contexto de empresa via `ImpersonationContext`
- Nenhum dado global ou de outra empresa visível
