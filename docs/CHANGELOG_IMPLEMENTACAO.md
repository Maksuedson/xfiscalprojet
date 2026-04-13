# Changelog de Implementação — xFiscal SaaS

## v6.0 — 13/04/2026 — PDV/Vendas e Módulos Operacionais

### Novas tabelas: suppliers, carriers, sales, sale_items (todas com RLS)
### Novo módulo: PDV / Vendas (`/dashboard/vendas`)
### Menu atualizado: "PDV / Vendas" no emissor
### Fluxo: Venda → rascunho → finalizada → emissão fiscal → faturada
### Relatório: `docs/RELATORIO_REFACTOR_PDV_EMPRESA.md`

---

## v5.0 — 13/04/2026 — Refatoração de Contexto Contador/Empresa

### Decisão Arquitetural
- Módulos operacionais (Clientes, Produtos, Fornecedores, Transportadoras, Notas Fiscais) removidos do menu principal do Contador
- Esses módulos agora aparecem apenas no contexto da Empresa (via botão "Acessar")
- Relatório técnico: `docs/RELATORIO_REFACTOR_CONTEXTO_CONTADOR_EMPRESA.md`

### Arquivos alterados
- `src/components/dashboard/DashboardLayout.tsx` — roles ajustados no navItems

---


## v4.0 — 13/04/2026 — Auditoria Funcional da Área do Contador

### Escopo
- Auditoria completa dos 13 menus do perfil Contador
- Análise de conexão com banco de dados (real vs mock)
- Identificação de redundâncias e problemas de arquitetura

### Resultado
- Relatório completo em `docs/RELATORIO_AREA_CONTADOR.md`
- 30% funcional real, 70% visual/mock
- 2 menus redundantes, 2 tabelas faltantes no banco
- Problema crítico: módulos operacionais sem seletor de empresa

---

## v3.0 — 13/04/2026 — Reestruturação do Módulo de Mensalidades

### Problema
- MensalidadesPage usava dados mockados e misturava lógica de admin/contador/emissor
- CobrancasEmpresasPage usava dados mockados
- Sem isolamento de dados por perfil no módulo de mensalidades
- Sidebar mostrava "Mensalidades" para admin redundantemente com "Cobranças Plataforma"

### Correções e Implementações

#### Separação de dois tipos de cobrança
- **Mensalidade da Plataforma** (admin → contador): tabela `platform_charges`, visível para admin e contador
- **Mensalidade da Empresa** (contador → empresa): tabela `company_charges`, visível para contador e empresa

#### Arquivos alterados
- `src/pages/dashboard/MensalidadesPage.tsx` — reescrito completo com 3 views isoladas por role (AdminMensalidades, ContadorMensalidades, EmissorMensalidades)
- `src/pages/contador/CobrancasEmpresasPage.tsx` — conectado ao Supabase real (removidos dados mockados)
- `src/hooks/useSupabaseData.ts` — hook `usePlatformCharges` agora aceita `accountantId` opcional para filtrar por contador
- `src/components/dashboard/DashboardLayout.tsx` — sidebar: "Mensalidades" removido do admin (já tem "Cobranças Plataforma")

#### Regras de hierarquia aplicadas
- Admin vê apenas mensalidades da plataforma (admin→contador)
- Contador vê: (1) sua mensalidade da plataforma (bloco separado), (2) cobranças das suas empresas
- Emissor vê apenas suas próprias mensalidades criadas pelo contador
- Nenhum perfil vê dados de outro contexto

#### Regras de plano
- Plano existe apenas no cadastro do contador (tabela `accountants.plano`)
- Empresa NÃO tem plano — valor da cobrança é definido pelo contador
- Valor da mensalidade do contador é baseado no plano vinculado

#### Segurança (RLS já existente)
- `platform_charges`: admin vê tudo, contador vê apenas suas cobranças
- `company_charges`: admin vê tudo, contador vê apenas de suas empresas, emissor vê apenas suas cobranças
- Dados isolados por `accountant_id` e `company_id` em todas as queries

---


## v2.0 — 11/04/2026

### Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/types/index.ts` | Tipos TypeScript centralizados (User, Contador, Empresa, Cobranca, NotaFiscal, AuditLog, CertificadoA1, etc.) |
| `src/pages/admin/ContadorDetalhePage.tsx` | Página de detalhe do contador com empresas vinculadas, KPIs e cobranças |
| `src/pages/admin/CobrancasPlataformaPage.tsx` | Módulo de cobranças Admin → Contadores com CRUD, filtros, detalhe e marcar pago |
| `src/pages/admin/AuditoriaPage.tsx` | Log de auditoria com busca, filtros por módulo/perfil e exportação CSV |
| `src/pages/contador/EmpresaDetalhePage.tsx` | Detalhe da empresa com certificado A1, notas, cobranças e upload |
| `src/pages/contador/CobrancasEmpresasPage.tsx` | Módulo cobranças Contador → Empresas com PIX QR Code e confirmação |
| `src/pages/contador/CertificadosPage.tsx` | Gestão de certificados A1 com upload, validade, alertas e histórico |
| `docs/MAPA_ALTERACOES.md` | Mapa completo de alterações e estrutura |
| `docs/CHANGELOG_IMPLEMENTACAO.md` | Este arquivo |

### Arquivos Alterados

| Arquivo | Alteração |
|---------|-----------|
| `src/App.tsx` | Adicionadas 6 novas rotas (contadores/:id, empresas/:id, cobrancas-plataforma, cobrancas-empresas, certificados, auditoria) |
| `src/components/dashboard/DashboardLayout.tsx` | Sidebar atualizada com novos itens: Cobranças Plataforma, Cobranças Empresas, Certificados A1, Auditoria |
| `src/components/dashboard/StatCard.tsx` | Aceita value string \| number (para exibir "Válido" no certificado) |
| `src/pages/dashboard/AdminDashboard.tsx` | KPIs completos: contadores pagos/pendentes/vencidos, receita, empresas por contador, alertas, últimas cobranças/pagamentos |
| `src/pages/dashboard/ContadorDashboard.tsx` | KPIs: empresas ativas/bloqueadas, cert. vencendo, cobranças geradas/pagas/pendentes/vencidas, receita, alertas fiscais |
| `src/pages/dashboard/EmissorDashboard.tsx` | KPIs: status certificado, atalhos emissão, cobranças pendentes, notas por tipo, clientes, produtos, faturamento |

### Regras de Negócio Aplicadas

1. **Cobranças Plataforma (Admin → Contador)**: Admin gera cobranças mensais por plano (Starter R$97, Pro R$297, Enterprise R$497). Pode filtrar por status, ver detalhe e marcar como pago.
2. **Cobranças Empresas (Contador → Empresa)**: Contador gera cobranças com QR Code PIX. Pode copiar código Copia e Cola e confirmar recebimento.
3. **Certificados A1**: Upload com validação, exibição de validade/status, alertas para vencimento, histórico de trocas. Certificado atual só é substituído após validação do novo.
4. **Auditoria**: Registra login, cadastro, emissão, cobrança, certificado, pagamento, exclusão, configuração. Filtrável por módulo e perfil.
5. **Dashboards**: Cada perfil vê apenas seus KPIs relevantes com dados consistentes (sem Math.random).

### Botões Funcionais Adicionados

- Admin Dashboard → "Ver todas" cobranças → navega para /dashboard/cobrancas-plataforma
- Contador Dashboard → "Ver todas" empresas → navega para /dashboard/empresas
- Emissor Dashboard → "Emitir NF-e" / "Emitir NFC-e" → navega para emissão
- Emissor Dashboard → "Ver cobranças" → navega para /dashboard/mensalidades
- Detalhe Contador → "Gerar Cobrança" → modal funcional
- Detalhe Empresa → "Nova Cobrança" / "Atualizar Certificado" → modais funcionais
- Certificados → "Upload" / "Histórico" por empresa → modais funcionais
- Auditoria → "Exportar CSV" → download real
- Cobranças Plataforma → "Nova Cobrança" / "Ver detalhe" / "Marcar pago" → funcionais
- Cobranças Empresas → "Nova Cobrança" / "QR Code PIX" / "Confirmar pagamento" → funcionais

## v3.0 — 13/04/2026 — Acesso Direto (Impersonação)

### Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/contexts/ImpersonationContext.tsx` | Contexto de impersonação com stack, permitindo admin→contador e contador→empresa |

### Arquivos Alterados

| Arquivo | Alteração |
|---------|-----------|
| `src/App.tsx` | Adicionado ImpersonationProvider envolvendo PaymentGatewayProvider |
| `src/components/dashboard/DashboardLayout.tsx` | Banner visual de acesso direto no topo + botão Voltar + sidebar adapta ao perfil efetivo |
| `src/pages/dashboard/DashboardHome.tsx` | Usa effectiveRole do ImpersonationContext para renderizar o dashboard correto |
| `src/pages/dashboard/ContadorDashboard.tsx` | Aceita prop overrideAccountantId para funcionar em impersonação |
| `src/pages/dashboard/EmissorDashboard.tsx` | Aceita prop overrideCompanyId para funcionar em impersonação |
| `src/pages/dashboard/ContadoresPage.tsx` | Botão "Acessar" agora chama enterContador() e redireciona ao dashboard |
| `src/pages/dashboard/EmpresasPage.tsx` | Botão "Acessar" agora chama enterEmpresa() e redireciona ao dashboard |
| `docs/MAPA_ALTERACOES.md` | Adicionado ImpersonationContext na estrutura |

### Como funciona

1. **Admin clica "Acessar" em um contador** → `enterContador(id, nome)` é chamado → sidebar muda para menu de contador → dashboard exibe dados do contador → banner azul no topo mostra "Você está acessando o ambiente do Contador X" com botão "Voltar para Admin"
2. **Contador (ou admin impersonando contador) clica "Acessar" em uma empresa** → `enterEmpresa(id, nome)` é chamado → sidebar muda para menu de emissor → dashboard exibe dados da empresa → banner mostra "Você está acessando o ambiente da Empresa Y" com botão "Voltar para Contador"
3. **Botão Voltar** → remove o último nível do stack de impersonação → restaura contexto anterior
4. **Stack** suporta admin→contador→empresa (2 níveis) com retorno progressivo
