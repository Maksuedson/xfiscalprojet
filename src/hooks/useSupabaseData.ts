import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ==================== ACCOUNTANTS ====================
export function useAccountants() {
  return useQuery({
    queryKey: ["accountants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accountants")
        .select("*, companies(count)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAccountant(id: string) {
  return useQuery({
    queryKey: ["accountants", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accountants")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateAccountant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { nome: string; email: string; cpf_cnpj: string; crc?: string; plano?: string; telefone?: string }) => {
      const { data, error } = await supabase.from("accountants").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accountants"] }),
  });
}

export function useUpdateAccountant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string; nome?: string; email?: string; cpf_cnpj?: string; crc?: string; plano?: string; telefone?: string; status?: string }) => {
      const { data, error } = await supabase.from("accountants").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accountants"] }),
  });
}

export function useDeleteAccountant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("accountants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accountants"] }),
  });
}

// ==================== COMPANIES ====================
export function useCompanies(accountantId?: string) {
  return useQuery({
    queryKey: ["companies", accountantId],
    queryFn: async () => {
      let q = supabase.from("companies").select("*, accountants(nome)").order("created_at", { ascending: false });
      if (accountantId) q = q.eq("accountant_id", accountantId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ["companies", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("*, accountants(nome)").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { razao_social: string; nome_fantasia?: string; cnpj: string; ie?: string; email?: string; telefone?: string; endereco?: string; cidade?: string; uf?: string; accountant_id: string }) => {
      const { data, error } = await supabase.from("companies").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase.from("companies").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useDeleteCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

// ==================== PLATFORM CHARGES ====================
export function usePlatformCharges() {
  return useQuery({
    queryKey: ["platform_charges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("platform_charges").select("*, accountants(nome, plano)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePlatformCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { accountant_id: string; competencia: string; valor: number; vencimento: string }) => {
      const { data, error } = await supabase.from("platform_charges").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform_charges"] }),
  });
}

export function useUpdatePlatformCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string; status?: string; pago_em?: string; forma_pagamento?: string }) => {
      const { data, error } = await supabase.from("platform_charges").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform_charges"] }),
  });
}

// ==================== COMPANY CHARGES ====================
export function useCompanyCharges(accountantId?: string, companyId?: string) {
  return useQuery({
    queryKey: ["company_charges", accountantId, companyId],
    queryFn: async () => {
      let q = supabase.from("company_charges").select("*, companies(razao_social, nome_fantasia), accountants(nome)").order("created_at", { ascending: false });
      if (accountantId) q = q.eq("accountant_id", accountantId);
      if (companyId) q = q.eq("company_id", companyId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCompanyCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { company_id: string; accountant_id: string; competencia: string; valor: number; vencimento: string }) => {
      const { data, error } = await supabase.from("company_charges").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["company_charges"] }),
  });
}

export function useUpdateCompanyCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string; status?: string; pago_em?: string; forma_pagamento?: string }) => {
      const { data, error } = await supabase.from("company_charges").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["company_charges"] }),
  });
}

// ==================== CERTIFICATES ====================
export function useCertificates(companyId?: string) {
  return useQuery({
    queryKey: ["certificates", companyId],
    queryFn: async () => {
      let q = supabase.from("company_certificates").select("*, companies(razao_social, nome_fantasia)").order("uploaded_at", { ascending: false });
      if (companyId) q = q.eq("company_id", companyId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

// ==================== CUSTOMERS ====================
export function useCustomers(companyId?: string) {
  return useQuery({
    queryKey: ["customers", companyId],
    queryFn: async () => {
      let q = supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (companyId) q = q.eq("company_id", companyId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { company_id: string; nome: string; cpf_cnpj?: string; email?: string; telefone?: string; endereco?: string; cidade?: string; uf?: string }) => {
      const { data, error } = await supabase.from("customers").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

// ==================== PRODUCTS ====================
export function useProducts(companyId?: string) {
  return useQuery({
    queryKey: ["products", companyId],
    queryFn: async () => {
      let q = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (companyId) q = q.eq("company_id", companyId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { company_id: string; nome: string; ncm?: string; unidade?: string; preco: number; cfop?: string; cst?: string }) => {
      const { data, error } = await supabase.from("products").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

// ==================== AUDIT LOGS ====================
export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateAuditLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_id?: string; perfil?: string; modulo: string; acao: string; detalhes?: string }) => {
      const { error } = await supabase.from("audit_logs").insert(input);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["audit_logs"] }),
  });
}

// ==================== DASHBOARD STATS ====================
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const [accountants, companies, charges] = await Promise.all([
        supabase.from("accountants").select("id, status, plano"),
        supabase.from("companies").select("id, accountant_id, status"),
        supabase.from("platform_charges").select("id, status, valor"),
      ]);

      const accs = accountants.data || [];
      const comps = companies.data || [];
      const chrgs = charges.data || [];

      return {
        totalContadores: accs.length,
        totalEmpresas: comps.length,
        contadoresAtivos: accs.filter(a => a.status === "ativo").length,
        chargesPago: chrgs.filter(c => c.status === "pago").reduce((s, c) => s + Number(c.valor), 0),
        chargesPendente: chrgs.filter(c => c.status === "pendente").reduce((s, c) => s + Number(c.valor), 0),
        chargesVencido: chrgs.filter(c => c.status === "vencido").reduce((s, c) => s + Number(c.valor), 0),
        countPago: chrgs.filter(c => c.status === "pago").length,
        countPendente: chrgs.filter(c => c.status === "pendente").length,
        countVencido: chrgs.filter(c => c.status === "vencido").length,
        totalCharges: chrgs.length,
      };
    },
  });
}

export function useContadorStats(accountantId?: string) {
  return useQuery({
    queryKey: ["contador_stats", accountantId],
    queryFn: async () => {
      if (!accountantId) return null;
      const [companies, charges, certs] = await Promise.all([
        supabase.from("companies").select("id, status").eq("accountant_id", accountantId),
        supabase.from("company_charges").select("id, status, valor").eq("accountant_id", accountantId),
        supabase.from("company_certificates").select("id, status, company_id").in(
          "company_id",
          (await supabase.from("companies").select("id").eq("accountant_id", accountantId)).data?.map(c => c.id) || []
        ),
      ]);

      const comps = companies.data || [];
      const chrgs = charges.data || [];
      const crts = certs.data || [];

      return {
        totalEmpresas: comps.length,
        empresasAtivas: comps.filter(c => c.status === "ativa").length,
        empresasBloqueadas: comps.filter(c => c.status === "bloqueada").length,
        certVencendo: crts.filter(c => c.status === "vencendo").length,
        chargesPagas: chrgs.filter(c => c.status === "pago").length,
        chargesPendentes: chrgs.filter(c => c.status === "pendente").length,
        chargesVencidas: chrgs.filter(c => c.status === "vencido").length,
        receitaMes: chrgs.filter(c => c.status === "pago").reduce((s, c) => s + Number(c.valor), 0),
        totalCerts: crts.length,
      };
    },
    enabled: !!accountantId,
  });
}
