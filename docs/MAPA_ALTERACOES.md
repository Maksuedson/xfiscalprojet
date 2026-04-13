# Mapa de Alterações — xFiscal SaaS

## 13/04/2026 — PDV/Vendas e Tabelas Operacionais

### Tabelas criadas
| Tabela | Descrição |
|---|---|
| `suppliers` | Fornecedores por empresa |
| `carriers` | Transportadoras por empresa |
| `sales` | Vendas/PDV por empresa |
| `sale_items` | Itens de cada venda |

### Arquivos criados/modificados
| Arquivo | Alteração |
|---|---|
| `src/pages/dashboard/VendasPage.tsx` | **NOVO** — PDV completo |
| `src/components/dashboard/DashboardLayout.tsx` | Menu "PDV / Vendas" para emissor |
| `src/App.tsx` | Rota `/dashboard/vendas` |

### Documentação
| Arquivo | Conteúdo |
|---|---|
| `docs/RELATORIO_REFACTOR_PDV_EMPRESA.md` | Relatório da refatoração |

---

## 13/04/2026 — Refatoração Contexto Contador/Empresa

### Arquivos modificados
| Arquivo | Alteração |
|---|---|
| `src/components/dashboard/DashboardLayout.tsx` | Removido role `contador` de Clientes, Produtos, Fornecedores, Transportadoras, Notas Fiscais |

### Documentação
| Arquivo | Conteúdo |
|---|---|
| `docs/RELATORIO_REFACTOR_CONTEXTO_CONTADOR_EMPRESA.md` | Análise completa e decisão técnica |

---


## 13/04/2026 — Auditoria Funcional da Área do Contador

### Documentação gerada
| Arquivo | Conteúdo |
|---|---|
| `docs/RELATORIO_AREA_CONTADOR.md` | Relatório completo de auditoria com análise dos 13 menus |

### Problemas identificados
- 6 módulos com dados mock (Clientes, Produtos, Fornecedores, Transportadoras, NF-e/NFC-e, PIX, Certificados, Relatórios)
- 2 menus redundantes (Cobranças Empresas duplica bloco 2 de Mensalidades; PIX separado)
- 2 tabelas faltantes no banco (suppliers, carriers)
- Módulos operacionais sem seletor de empresa (Clientes, Produtos etc.)

---

## 13/04/2026 — Módulo de Mensalidades Reestruturado

### Arquivos modificados
| Arquivo | Alteração |
|---|---|
| `src/pages/dashboard/MensalidadesPage.tsx` | Reescrito: 3 views por perfil (admin/contador/emissor), dados reais |
| `src/pages/contador/CobrancasEmpresasPage.tsx` | Conectado ao Supabase, removidos dados mock |
| `src/hooks/useSupabaseData.ts` | `usePlatformCharges` aceita filtro por `accountantId` |
| `src/components/dashboard/DashboardLayout.tsx` | Sidebar: "Mensalidades" só para contador e emissor |
| `docs/CHANGELOG_IMPLEMENTACAO.md` | Documentação da reestruturação |

### Hierarquia de mensalidades
- Admin → Cobranças Plataforma (admin→contador)
- Contador → Mensalidades (bloco plataforma + bloco empresas)
- Emissor → Mensalidades (apenas suas cobranças)

---


## Estrutura de Pastas

```
src/
├── types/
│   └── index.ts                          # Tipos centralizados do sistema
├── contexts/
│   ├── AuthContext.tsx                    # Autenticação com 3 perfis
│   └── ImpersonationContext.tsx           # Acesso direto (admin→contador, contador→empresa)
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx           # Layout principal com sidebar
│   │   ├── DataTable.tsx                 # Tabela reutilizável
│   │   └── StatCard.tsx                  # Card de estatística
│   ├── ProtectedRoute.tsx                # Proteção de rotas
│   └── ui/                               # Componentes shadcn/ui
├── pages/
│   ├── admin/
│   │   ├── ContadorDetalhePage.tsx        # Detalhe do contador (empresas, cobranças)
│   │   ├── CobrancasPlataformaPage.tsx    # Cobranças Admin → Contadores
│   │   └── AuditoriaPage.tsx             # Logs de auditoria
│   ├── contador/
│   │   ├── EmpresaDetalhePage.tsx         # Detalhe da empresa (notas, cert, cobranças)
│   │   ├── CobrancasEmpresasPage.tsx      # Cobranças Contador → Empresas
│   │   └── CertificadosPage.tsx          # Gestão de certificados A1
│   └── dashboard/
│       ├── DashboardHome.tsx             # Roteador de dashboard por perfil
│       ├── AdminDashboard.tsx            # Dashboard admin com KPIs
│       ├── ContadorDashboard.tsx         # Dashboard contador com KPIs
│       ├── EmissorDashboard.tsx          # Dashboard emissor com KPIs
│       ├── EmpresasPage.tsx              # CRUD empresas
│       ├── ClientesPage.tsx              # CRUD clientes
│       ├── ProdutosPage.tsx              # CRUD produtos
│       ├── FornecedoresPage.tsx          # CRUD fornecedores
│       ├── TransportadorasPage.tsx       # CRUD transportadoras
│       ├── ContadoresPage.tsx            # CRUD contadores
│       ├── NFePage.tsx                   # NF-e (entrada/saída/devolução)
│       ├── NFCePage.tsx                  # NFC-e
│       ├── PixPage.tsx                   # Cobranças PIX
│       ├── MensalidadesPage.tsx          # Mensalidades
│       ├── RelatoriosPage.tsx            # Relatórios com filtros/exportação
│       └── ConfiguracoesPage.tsx         # Configurações e certificado
└── App.tsx                               # Rotas do sistema
```

## Rotas do Sistema

| Rota | Componente | Perfis |
|------|-----------|--------|
| `/dashboard` | DashboardHome → Admin/Contador/Emissor | Todos |
| `/dashboard/contadores` | ContadoresPage | Admin |
| `/dashboard/contadores/:id` | ContadorDetalhePage | Admin |
| `/dashboard/empresas` | EmpresasPage | Admin, Contador |
| `/dashboard/empresas/:id` | EmpresaDetalhePage | Contador |
| `/dashboard/cobrancas-plataforma` | CobrancasPlataformaPage | Admin |
| `/dashboard/cobrancas-empresas` | CobrancasEmpresasPage | Contador |
| `/dashboard/certificados` | CertificadosPage | Contador |
| `/dashboard/auditoria` | AuditoriaPage | Admin |
| `/dashboard/clientes` | ClientesPage | Contador, Emissor |
| `/dashboard/produtos` | ProdutosPage | Contador, Emissor |
| `/dashboard/fornecedores` | FornecedoresPage | Contador, Emissor |
| `/dashboard/transportadoras` | TransportadorasPage | Contador, Emissor |
| `/dashboard/nfe/:tipo` | NFePage | Contador, Emissor |
| `/dashboard/nfce` | NFCePage | Contador, Emissor |
| `/dashboard/pix` | PixPage | Contador |
| `/dashboard/mensalidades` | MensalidadesPage | Todos |
| `/dashboard/relatorios` | RelatoriosPage | Todos |
| `/dashboard/configuracoes` | ConfiguracoesPage | Todos |

## Hierarquia de Acesso

- **Admin**: Controle total. Gerencia contadores, cobranças da plataforma, auditoria
- **Contador**: Gerencia empresas, certificados A1, cobranças para empresas, PIX
- **Emissor**: Emite notas, gerencia clientes/produtos, vê cobranças pendentes
