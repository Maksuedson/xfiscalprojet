# Relatório — Fechamento da Arquitetura Financeira e PDV

**Data:** 13/04/2026

---

## 1. Resumo Executivo

Refatoração final para eliminar fragmentação do módulo financeiro do contador e consolidar o fluxo PDV → Nota Fiscal.

---

## 2. O que foi removido do menu do contador

| Menu removido | Motivo |
|---|---|
| Cobranças Empresas | Redundante — já estava dentro de Mensalidades (bloco 2) |
| Cobrança PIX | PIX é método de pagamento, não módulo — absorvido em Mensalidades |

---

## 3. Menu final do Contador

| Menu | Função |
|---|---|
| Dashboard | KPIs da carteira |
| Empresas | CRUD + botão Acessar |
| Mensalidades | Plataforma (bloco 1) + Cobranças Empresas (bloco 2) + PIX como método |
| Certificados A1 | Gestão de certificados digitais |
| Relatórios | Relatórios gerenciais |
| Configurações | Perfil e preferências |

---

## 4. Módulo Mensalidades — Centralizado

O módulo `MensalidadesPage.tsx` já concentrava:

1. **Bloco 1** — Mensalidade da Plataforma (cobranças admin → contador)
2. **Bloco 2** — Cobranças das Empresas (cobranças contador → empresas)
   - Criar nova cobrança
   - Filtrar por status (pago/pendente/vencido)
   - Confirmar pagamento (PIX como forma de pagamento)
   - Ver detalhes
   - Histórico e inadimplência

PIX funciona como **forma de pagamento** dentro das cobranças, não como módulo separado.

---

## 5. Fluxo PDV → Nota Fiscal

### Status da Venda

| Status | Descrição | Ações disponíveis |
|---|---|---|
| Rascunho | Venda em construção | Finalizar, Cancelar, Editar |
| Finalizada | Pronta para faturamento | Emitir NF-e |
| Faturada | Nota fiscal emitida | Somente visualização |
| Cancelada | Venda cancelada | Somente visualização |

### Regras implementadas

- Venda nasce como **rascunho**
- Somente **rascunho** pode ser finalizada ou cancelada
- Somente **finalizada** pode gerar NF-e (botão "Emitir NF-e")
- Ao emitir, status muda para **faturada**
- Venda **faturada** não permite nova emissão (proteção contra duplicação)
- Venda **cancelada** não pode emitir nota

### Dados herdados pela NF-e

- Cliente (nome, CPF/CNPJ)
- Itens (produto, quantidade, valor unitário)
- Total e subtotal
- Observações

---

## 6. Regra de Estoque (análise)

Decisão técnica: estoque **não implementado** nesta fase por simplicidade.

Regra recomendada para implementação futura:
- **Rascunho** → não baixa estoque
- **Finalizada** → reserva opcional
- **Faturada** → baixa definitiva

---

## 7. Contexto da Empresa

Módulos operacionais permanecem **exclusivamente** no contexto da empresa (role `emissor`):

- Clientes, Produtos, Fornecedores, Transportadoras
- PDV / Vendas
- Notas Fiscais (NF-e/NFC-e)

O contador acessa esses módulos somente via botão **Acessar** na empresa.

---

## 8. Arquivos alterados

| Arquivo | Alteração |
|---|---|
| `src/components/dashboard/DashboardLayout.tsx` | Removidos menus "Cobranças Empresas" e "Cobrança PIX" do contador |
| `src/pages/dashboard/VendasPage.tsx` | Adicionado botão "Emitir NF-e" para vendas finalizadas |
| `src/App.tsx` | Removida rota `/dashboard/cobrancas-empresas` e import |

---

## 9. Rotas removidas

| Rota | Motivo |
|---|---|
| `/dashboard/cobrancas-empresas` | Funcionalidade absorvida por Mensalidades |

---

## 10. Veredito

A arquitetura financeira está consolidada:
- Zero fragmentação no menu do contador
- Financeiro centralizado em Mensalidades
- Fluxo PDV → NF-e com regras de status claras
- Proteção contra faturamento duplicado
- Isolamento por empresa garantido via `company_id` + RLS
