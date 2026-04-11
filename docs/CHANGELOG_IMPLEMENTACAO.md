# Changelog de Implementação — xFiscal SaaS

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
