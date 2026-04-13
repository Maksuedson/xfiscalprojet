# Relatório: Refatoração de Contexto Contador → Empresa

**Data:** 2026-04-13

## Problema Analisado

O contador possuía acesso direto aos módulos operacionais (Clientes, Produtos, Fornecedores, Transportadoras, Notas Fiscais) no seu menu principal, criando ambiguidade de contexto — esses dados pertencem a empresas específicas, não ao contador.

## Análise Comparativa

### Opção A — Manter no contador
- **Contra:** Exige seletor de empresa, mistura contextos, aumenta complexidade, risco de dados cruzados
- **Contra:** Duplicação de lógica entre visão contador e visão empresa

### Opção B — Mover para contexto da empresa ✅ ESCOLHIDA
- **Pró:** Isolamento natural por `company_id`
- **Pró:** Menu do contador mais limpo e estratégico
- **Pró:** Zero risco de mistura de dados entre empresas
- **Pró:** Código mais simples — sem seletor de empresa necessário
- **Pró:** Mesmo fluxo para contador e empresa (via impersonação)

## Decisão Técnica

Opção B adotada. O sistema de impersonação já existente (`ImpersonationContext`) faz o papel de troca de contexto: quando o contador clica "Acessar" em uma empresa, o `effectiveRole` muda para `emissor` e os menus operacionais aparecem automaticamente.

## Alterações Realizadas

### Arquivo: `src/components/dashboard/DashboardLayout.tsx`
- Módulos removidos do role `contador` no `navItems`:
  - Clientes
  - Produtos
  - Fornecedores
  - Transportadoras
  - Notas Fiscais
- Esses módulos agora aparecem apenas com role `emissor`

### Menu Final do Contador
| Menu | Função |
|------|--------|
| Dashboard | Visão geral da carteira |
| Empresas | Gestão da carteira + botão Acessar |
| Cobranças Empresas | Cobranças contador→empresa |
| Mensalidades | Mensalidade com a plataforma |
| Certificados A1 | Gestão de certificados |
| Cobrança PIX | Cobranças via PIX |
| Relatórios | Relatórios gerenciais |
| Configurações | Config do perfil |

### Menu da Empresa (via Acessar)
| Menu | Função |
|------|--------|
| Dashboard | KPIs da empresa |
| Clientes | Cadastro de clientes |
| Produtos | Cadastro de produtos |
| Fornecedores | Cadastro de fornecedores |
| Transportadoras | Cadastro de transportadoras |
| Notas Fiscais | NF-e/NFC-e |
| Mensalidades | Cobranças do contador |
| Relatórios | Relatórios operacionais |
| Configurações | Config da empresa |

## Fluxo de Uso
1. Contador abre painel → vê menu estratégico
2. Vai em Empresas → clica **Acessar**
3. Banner aparece: "Você está acessando o ambiente da Empresa X"
4. Menu muda para módulos operacionais da empresa
5. Trabalha clientes, produtos, NF-e, etc.
6. Clica **Voltar para Contador** → retorna ao painel estratégico

## Segurança
- Dados filtrados por `company_id` via RLS no banco
- Sem listagem global — sempre contextual
- Impersonação controlada por stack com validação de role
