# Relatório de Auditoria Funcional — Área do Contador

**Data:** 13/04/2026  
**Versão:** 1.0  
**Escopo:** Análise completa de todas as funcionalidades disponíveis para o perfil Contador no painel do xFiscal SaaS.

---

## 1. Resumo Executivo

A área do Contador possui **13 itens de menu** (Dashboard, Empresas, Cobranças Empresas, Mensalidades, Certificados A1, Clientes, Produtos, Fornecedores, Transportadoras, Notas Fiscais, Cobrança PIX, Relatórios, Configurações).

**Estado geral: PARCIALMENTE FUNCIONAL — precisa de melhorias significativas para uso comercial.**

### Pontos positivos
- Dashboard com KPIs reais conectados ao banco de dados
- Empresas com CRUD completo e dados persistidos
- Cobranças Empresas e Mensalidades conectados ao Supabase
- Hierarquia de acesso (impersonação) funcionando
- Separação clara entre mensalidade plataforma e cobranças empresas

### Pontos críticos
- **6 de 13 módulos usam dados mock** (Clientes, Produtos, Fornecedores, Transportadoras, NF-e/NFC-e, PIX, Relatórios)
- Certificados A1 usa dados mock estáticos
- Clientes/Produtos não estão vinculados a nenhuma empresa específica
- Notas fiscais são completamente simuladas
- Relatórios usam dados fictícios hardcoded
- Cobrança PIX usa dados mock e não integra com gateway real

---

## 2. Análise Menu por Menu

### 2.1 Dashboard

**O que faz hoje:** Exibe 8 cards de KPI (Empresas, Ativas, Bloqueadas, Cert. Vencendo, Pagas, Pendentes, Vencidas, Receita) + 2 tabelas (Empresas da Carteira, Últimas Cobranças).

**Função real:** Dar visão geral rápida da carteira de empresas e situação financeira.

**Coerente com o perfil?** ✅ Sim. Usa dados reais do Supabase via `useContadorStats`.

**O que está bom:**
- 8 KPIs em grid responsivo cobrem bem as métricas essenciais
- Dados reais do banco
- Links "Ver todas →" funcionais

**O que está faltando:**
- ❌ Gráfico de evolução de receita (últimos 6 meses)
- ❌ Alerta visual de certificados vencidos/vencendo no topo
- ❌ Indicador de inadimplência (% de vencidos sobre total)
- ❌ Atalhos de ação rápida (gerar cobrança em lote, acessar empresa)
- ❌ Card de "Minha mensalidade" com a plataforma (status/vencimento)

**O que está desnecessário:** Nada — todos os cards são relevantes.

**Fluxo:** Bom, mas superficial. Falta profundidade para decisão.

**Melhoria recomendada:** Adicionar bloco de "Alertas Urgentes" (cert vencido, cobranças vencidas) e mini-gráfico de receita mensal.

---

### 2.2 Empresas

**O que faz hoje:** CRUD completo de empresas (criar, editar, excluir, buscar). Botão "Acessar" para impersonação. Link para detalhe da empresa.

**Função real:** Gestão da carteira de empresas do contador.

**Coerente com o perfil?** ✅ Sim. Dados reais, filtrados por `accountant_id`.

**O que está bom:**
- CRUD funcional com persistência no Supabase
- Busca por nome/CNPJ
- Botão "Acessar" para entrar no contexto da empresa
- Link para página de detalhe

**O que está faltando:**
- ❌ Campo de "valor da mensalidade" no cadastro da empresa (regra de negócio obrigatória)
- ❌ Indicador visual de status do certificado na tabela
- ❌ Indicador visual de inadimplência na tabela
- ❌ Filtro por status (ativa/bloqueada)
- ❌ Exportação da lista de empresas

**O que está desnecessário:** Nada.

**Fluxo:** Bom. Formulário claro, ações visíveis.

**Melhoria recomendada:** Adicionar coluna "Cert. A1" e "Mensalidade" na tabela para visão rápida. Adicionar campo de valor mensal no cadastro.

---

### 2.3 Cobranças Empresas

**O que faz hoje:** Lista cobranças do contador para suas empresas. Filtro por status. Criar nova cobrança. Marcar como pago. Modal de detalhe.

**Função real:** Gestão financeira das cobranças contador→empresa.

**Coerente com o perfil?** ✅ Sim. Dados reais filtrados por `accountant_id`.

**O que está bom:**
- CRUD funcional conectado ao Supabase
- 4 StatCards (Total Recebido, Pendente, Cobranças Pagas, Total)
- Filtro por status
- Modal de detalhe

**O que está faltando:**
- ❌ Geração de cobrança em lote (todas as empresas de uma vez)
- ❌ Geração automática mensal (recorrência)
- ❌ Exportação de relatório financeiro
- ❌ Filtro por empresa
- ❌ Filtro por período/competência

**Redundância:** ⚠️ **Este menu é parcialmente redundante com o bloco 2 de Mensalidades.** O menu "Mensalidades" já exibe as cobranças das empresas com funcionalidade quase idêntica. Isso gera confusão.

**Melhoria recomendada:** Unificar com o bloco de cobranças dentro de Mensalidades, ou manter este como o módulo principal e remover o bloco duplicado de Mensalidades.

---

### 2.4 Mensalidades

**O que faz hoje:** Dois blocos separados:
1. **Minha Mensalidade (Plataforma):** Exibe cobranças admin→contador com plano, competência, valor, status.
2. **Cobranças das Minhas Empresas:** Mesmo conteúdo de "Cobranças Empresas" — StatCards, filtro, tabela, criar cobrança, marcar como pago.

**Função real:** Visão consolidada de mensalidades (plataforma + empresas).

**Coerente com o perfil?** ✅ Sim. Hierarquia correta.

**O que está bom:**
- Separação visual entre plataforma e empresas
- Bloco 1 mostra claramente o plano e valor
- Dados reais do Supabase

**O que está faltando:**
- ❌ Card-resumo do plano (nome, valor, próximo vencimento, status) — hoje é uma tabela fria
- ❌ Botão de pagar/ver QR code para a mensalidade da plataforma

**Redundância:** ⚠️ **O bloco 2 é duplicação quase total de Cobranças Empresas.** Mesmas queries, mesmos botões, mesma tabela.

**Melhoria recomendada:** 
- Bloco 1: Transformar em card visual (não tabela) com plano, valor, status e ação de pagamento.
- Bloco 2: Remover e colocar apenas link para "Cobranças Empresas", ou vice-versa.

---

### 2.5 Certificados A1

**O que faz hoje:** Lista certificados com status (válido, vencendo, vencido, sem certificado). Upload de novo certificado. Histórico por empresa.

**Função real:** Gestão de certificados digitais A1 das empresas do contador.

**Coerente com o perfil?** ✅ Sim.

**⚠️ PROBLEMA CRÍTICO:** **Usa dados mock hardcoded.** O array `initialCertificados` contém dados estáticos. O banco tem tabela `company_certificates` com dados reais, mas esta página NÃO consulta o Supabase.

**O que está bom:**
- Layout e UX estão profissionais
- Alertas visuais de vencimento
- Modal de upload e histórico

**O que está faltando:**
- ❌ Conexão com `company_certificates` do Supabase
- ❌ Upload real de arquivo (Supabase Storage)
- ❌ Validação real do certificado .pfx
- ❌ Filtro por status

**Melhoria recomendada:** Conectar aos hooks `useCertificates` já existentes. Implementar upload real via Supabase Storage.

---

### 2.6 Clientes

**O que faz hoje:** CRUD de clientes (criar, editar, excluir, buscar).

**Função real:** Cadastro de clientes para emissão de notas fiscais.

**Coerente com o perfil?** ⚠️ Parcial. O contador vê clientes, mas eles não estão vinculados a nenhuma empresa.

**⚠️ PROBLEMA CRÍTICO:** **Usa dados mock.** O array `initialClientes` é estático. A tabela `customers` existe no banco com `company_id`, mas a página não consulta o Supabase.

**O que está faltando:**
- ❌ Conexão com tabela `customers` do Supabase
- ❌ Filtro por empresa (o contador tem múltiplas empresas)
- ❌ Seletor de empresa ativa (contexto)
- ❌ Vinculação automática ao `company_id` correto

**Problema de hierarquia:** O contador gerencia clientes de VÁRIAS empresas. Sem filtro/seletor de empresa, não se sabe de qual empresa é cada cliente. Isso é um erro de arquitetura.

**Melhoria recomendada:** Adicionar seletor de empresa no topo. Conectar ao Supabase. Filtrar por `company_id`.

---

### 2.7 Produtos

**O que faz hoje:** CRUD de produtos (nome, NCM, CFOP, unidade, valor, estoque).

**Função real:** Cadastro de produtos/serviços para emissão fiscal.

**Coerente com o perfil?** ⚠️ Mesmo problema de Clientes.

**⚠️ PROBLEMA CRÍTICO:** **Usa dados mock.** Mesmo padrão de Clientes — dados estáticos, sem conexão com tabela `products` do Supabase.

**O que está faltando:**
- ❌ Conexão com `products` do Supabase
- ❌ Seletor de empresa (multi-empresa)
- ❌ Campo CST (existe na tabela mas não no formulário)
- ❌ Importação em massa (CSV/Excel)

**Melhoria recomendada:** Conectar ao Supabase. Adicionar seletor de empresa. Incluir campo CST.

---

### 2.8 Fornecedores

**O que faz hoje:** CRUD de fornecedores (razão social, CNPJ, email, telefone, cidade, UF).

**Função real:** Cadastro de fornecedores para notas de entrada.

**Coerente com o perfil?** ⚠️ Parcial.

**⚠️ PROBLEMA CRÍTICO:** **Usa dados mock.** Não existe tabela de fornecedores no banco. Os dados são perdidos ao recarregar.

**O que está faltando:**
- ❌ Tabela `suppliers` no banco de dados
- ❌ Persistência real
- ❌ Vinculação por empresa

**Melhoria recomendada:** Criar tabela `suppliers` no Supabase. Conectar ao banco. Vincular a `company_id`.

---

### 2.9 Transportadoras

**O que faz hoje:** CRUD de transportadoras (razão social, CNPJ, RNTRC, telefone, UF).

**Função real:** Cadastro de transportadoras para notas com frete.

**Coerente com o perfil?** ⚠️ Parcial.

**⚠️ PROBLEMA CRÍTICO:** **Usa dados mock.** Não existe tabela de transportadoras no banco.

**O que está faltando:**
- ❌ Tabela `carriers` no banco de dados
- ❌ Persistência real
- ❌ Vinculação por empresa

**Melhoria recomendada:** Criar tabela `carriers`. Conectar ao banco.

---

### 2.10 Notas Fiscais (NF-e + NFC-e)

**O que faz hoje:** 
- NF-e: 3 submenus (Entrada, Saída, Devolução) com listagem, emissão e visualização.
- NFC-e: Listagem, emissão e visualização de cupons.

**Função real:** Emissão e gestão de documentos fiscais eletrônicos.

**Coerente com o perfil?** ✅ Sim, essencial para o contador.

**⚠️ PROBLEMA CRÍTICO:** **100% mock.** Dados hardcoded, emissão fake (toast de sucesso), nenhuma integração com SEFAZ, nenhuma tabela de notas no banco.

**O que está bom:**
- Interface completa e profissional
- Modal de emissão com campos corretos (CFOP, natureza, destinatário)
- Modal de visualização detalhada com impostos
- Chave de acesso exibida corretamente

**O que está faltando:**
- ❌ Tabela `invoices` / `nfe` no banco
- ❌ Integração real com SEFAZ (complexo, requer backend)
- ❌ Seletor de empresa emitente
- ❌ Seleção de cliente/produto do cadastro
- ❌ Cálculo automático de impostos
- ❌ Geração real de DANFE/XML
- ❌ Status real de transmissão

**Nota:** A emissão fiscal é o módulo mais complexo do sistema e requer integração com API de NF-e (ex: Focus NFe, eNotas, Webmania). Não é possível implementar internamente.

**Melhoria recomendada:** Priorizar integração com API fiscal de terceiros. Enquanto isso, adicionar disclaimer claro de "módulo em implantação" e desabilitar botão de emissão real.

---

### 2.11 Cobrança PIX

**O que faz hoje:** Gerar cobranças PIX, exibir QR Code simulado, marcar como pago, ver detalhes.

**Função real:** Cobrar empresas via PIX.

**Coerente com o perfil?** ⚠️ Parcial.

**⚠️ PROBLEMA CRÍTICO:** **100% mock.** Dados estáticos, QR Code falso (grid visual), lista de empresas hardcoded. O gateway de pagamento está nas configurações mas não há integração real.

**Redundância:** ⚠️ Sobrepõe-se parcialmente com Cobranças Empresas. A diferença é que PIX teria o método de cobrança específico, mas hoje ambos funcionam de forma independente sem conexão.

**O que está faltando:**
- ❌ Integração real com Mercado Pago/Asaas
- ❌ Geração de QR Code PIX real
- ❌ Webhook de confirmação automática
- ❌ Conexão com tabela `company_charges`
- ❌ Lista de empresas do banco

**Melhoria recomendada:** Este módulo deveria ser uma funcionalidade DENTRO de Cobranças Empresas (forma de pagamento = PIX), não um menu separado. Integrar com gateway configurado pelo admin.

---

### 2.12 Relatórios

**O que faz hoje:** Gráfico de barras de faturamento mensal, pizza de notas por tipo, DRE simplificado. Filtro de período. Exportação CSV.

**Função real:** Análise financeira e fiscal da carteira.

**Coerente com o perfil?** ✅ Sim.

**⚠️ PROBLEMA:** **Dados 100% mock/hardcoded.** Faturamento, notas e DRE são arrays estáticos. Não refletem dados reais.

**O que está bom:**
- Interface visual excelente (Recharts)
- DRE simplificado é um diferencial forte
- Exportação CSV funcional

**O que está faltando:**
- ❌ Dados reais do banco
- ❌ Filtro por empresa
- ❌ Relatório de inadimplência
- ❌ Relatório de cobranças
- ❌ Relatório de certificados (vencimentos)
- ❌ Exportação PDF

**Melhoria recomendada:** Conectar ao Supabase. Adicionar relatórios de cobranças e inadimplência como prioridade (dados já existem no banco). DRE e faturamento dependem de dados fiscais que ainda são mock.

---

### 2.13 Configurações

**O que faz hoje:** Dados da conta (nome, usuário, email, telefone). Upload de certificado A1. Preferências de notificação. Alterar senha. Gateway de pagamento (admin only).

**Função real:** Configurações do perfil e preferências.

**Coerente com o perfil?** ⚠️ Parcial.

**O que está bom:**
- Layout organizado por blocos
- Seção de certificado digital
- Notificações configuráveis

**O que está faltando:**
- ❌ Dados do perfil não salvam no Supabase
- ❌ Alteração de senha não funciona de verdade
- ❌ Upload de certificado não funciona de verdade
- ❌ Notificações não são reais (não há sistema de push/email)
- ❌ Falta exibir dados do plano do contador (qual plano, valor, próximo vencimento)
- ❌ Falta dados do escritório contábil (CRC, CNPJ, endereço)

**Melhoria recomendada:** Conectar ao Supabase para salvar perfil. Adicionar bloco "Meu Escritório" com dados cadastrais. Adicionar bloco "Meu Plano" com resumo.

---

## 3. O que está Desnecessário

| Item | Problema | Recomendação |
|------|----------|--------------|
| **Cobranças Empresas** como menu separado + bloco 2 de Mensalidades | Duplicação total de funcionalidade | Manter apenas UM deles |
| **Cobrança PIX** como menu separado | Deveria ser método de pagamento dentro de Cobranças | Absorver como funcionalidade de Cobranças |
| Menu **Certificados A1** com dados mock | Funcionalidade existe mas não funciona de verdade | Conectar ou marcar como "em breve" |

---

## 4. O que está Faltando

### Funcionalidades críticas ausentes:
1. **Seletor de empresa ativa** — O contador gerencia múltiplas empresas, mas Clientes, Produtos, Fornecedores e Transportadoras não sabem de qual empresa são.
2. **Conexão com banco** para Clientes, Produtos, Fornecedores, Transportadoras, Certificados
3. **Tabelas no banco** para Fornecedores e Transportadoras (não existem)
4. **Bloco "Meu Plano"** no dashboard ou configurações
5. **Alertas de inadimplência** no dashboard
6. **Geração de cobrança em lote** (todas empresas de uma vez)
7. **Relatórios reais** com dados do banco

### Funcionalidades desejáveis:
8. Gráfico de receita no dashboard
9. Exportação PDF de relatórios
10. Histórico de ações/log
11. Importação de dados (CSV)
12. Integração real com API fiscal

---

## 5. O que precisa ser Reorganizado

### Ordem atual do menu:
```
Dashboard → Empresas → Cobranças Empresas → Mensalidades → Certificados A1 → 
Clientes → Produtos → Fornecedores → Transportadoras → Notas Fiscais → 
Cobrança PIX → Relatórios → Configurações
```

### Ordem recomendada (agrupada por contexto):
```
📊 Dashboard
─── CARTEIRA ───
🏢 Empresas
🔐 Certificados A1
─── FINANCEIRO ───
💰 Mensalidades (unificado: plataforma + empresas)
─── OPERACIONAL ───
👥 Clientes
📦 Produtos
🚛 Fornecedores
🚚 Transportadoras
─── FISCAL ───
📄 Notas Fiscais (NF-e + NFC-e)
─── ANÁLISE ───
📊 Relatórios
─── SISTEMA ───
⚙️ Configurações
```

### Menus a REMOVER:
- **Cobranças Empresas** (unificar com Mensalidades)
- **Cobrança PIX** (absorver como método dentro de Mensalidades)

---

## 6. Melhorias Recomendadas

### Prioridade ALTA (essencial para uso real):
1. Conectar Clientes, Produtos ao Supabase com seletor de empresa
2. Conectar Certificados ao Supabase (hooks já existem)
3. Criar tabelas de Fornecedores e Transportadoras
4. Eliminar duplicação Cobranças Empresas ↔ Mensalidades
5. Adicionar seletor de empresa para módulos operacionais

### Prioridade MÉDIA (qualidade profissional):
6. Relatórios com dados reais (cobranças e inadimplência)
7. Dashboard com alertas, gráfico de receita e bloco de plano
8. Configurações salvando no banco real
9. Reorganizar menu por agrupamento

### Prioridade BAIXA (diferencial comercial):
10. Geração de cobrança em lote
11. Integração com API fiscal
12. Exportação PDF
13. Sistema de notificações real
14. Importação CSV

---

## 7. Veredito Final

### A área do contador está pronta? ❌ NÃO

### Estado atual:
- **30% funcional real** (Dashboard, Empresas, Cobranças/Mensalidades)
- **70% visual/mock** (Clientes, Produtos, Fornecedores, Transportadoras, NF-e, NFC-e, PIX, Relatórios, Certificados)

### Para ficar pronta para uso:
1. Conectar 5 módulos ao banco de dados
2. Criar 2 tabelas faltantes
3. Eliminar 2 menus redundantes
4. Implementar seletor de empresa

### Para ficar profissional/comercial:
5. Relatórios com dados reais
6. Dashboard aprimorado
7. Reorganização do menu
8. Integração fiscal (API de NF-e)

### Percepção de valor:
- Visualmente o painel é **muito bom** — layout profissional, responsivo, cores consistentes
- Funcionalmente está **fraco** — mais da metade dos módulos não persiste dados
- Para vender como SaaS: precisa conectar os módulos essenciais ao banco e eliminar a duplicação

### Esforço estimado para versão funcional mínima:
- Conexão dos 5 módulos mock: ~2-3 iterações
- Tabelas faltantes: 1 migração
- Reorganização de menu: 1 iteração
- Total: **4-5 iterações de desenvolvimento**

---

*Relatório gerado em 13/04/2026 como parte da auditoria funcional do xFiscal SaaS.*
