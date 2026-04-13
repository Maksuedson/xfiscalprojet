const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: string[] = [];

  // Helper to create user + role + profile
  async function ensureUser(email: string, password: string, nome: string, role: "admin" | "contador" | "emissor") {
    // Check if user exists
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing?.users?.find((u: any) => u.email === email);
    
    let userId: string;
    if (found) {
      userId = found.id;
      results.push(`User ${email} already exists (${userId})`);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome },
      });
      if (error) { results.push(`Error creating ${email}: ${error.message}`); return null; }
      userId = data.user.id;
      results.push(`Created user ${email} (${userId})`);
    }

    // Ensure profile
    await supabase.from("profiles").upsert({ user_id: userId, nome }, { onConflict: "user_id" });

    // Ensure role
    await supabase.from("user_roles").upsert({ user_id: userId, role }, { onConflict: "user_id,role" });

    return userId;
  }

  try {
    // 1. Create admin
    const adminId = await ensureUser("admin@xfiscal.com", "admin123", "Administrador", "admin");

    // 2. Create contador
    const contadorId = await ensureUser("contador@xfiscal.com", "contador123", "João Silva Contabilidade", "contador");

    // 3. Create emissor
    const emissorId = await ensureUser("emissor@xfiscal.com", "emissor123", "Tech Solutions LTDA", "emissor");

    // 4. Create accountant record for contador
    if (contadorId) {
      const { data: existingAcc } = await supabase.from("accountants").select("id").eq("user_id", contadorId).single();
      let accountantDbId: string;
      if (existingAcc) {
        accountantDbId = existingAcc.id;
        results.push(`Accountant record exists (${accountantDbId})`);
      } else {
        const { data: newAcc, error } = await supabase.from("accountants").insert({
          user_id: contadorId,
          nome: "João Silva Contabilidade",
          email: "contador@xfiscal.com",
          cpf_cnpj: "12.345.678/0001-90",
          crc: "1SP123456",
          plano: "Pro",
          status: "ativo",
        }).select().single();
        if (error) { results.push(`Error creating accountant: ${error.message}`); }
        else { accountantDbId = newAcc.id; results.push(`Created accountant (${accountantDbId})`); }
      }

      // 5. Create companies for this accountant
      if (accountantDbId!) {
        const companiesData = [
          { accountant_id: accountantDbId, razao_social: "Tech Solutions LTDA", nome_fantasia: "Tech Solutions", cnpj: "11.222.333/0001-44", ie: "123456789", email: "contato@techsol.com", cidade: "São Paulo", uf: "SP", status: "ativa" as const, user_id: emissorId || undefined },
          { accountant_id: accountantDbId, razao_social: "Comércio Digital ME", nome_fantasia: "Comércio Digital", cnpj: "22.333.444/0001-55", ie: "987654321", email: "contato@comdig.com", cidade: "Rio de Janeiro", uf: "RJ", status: "ativa" as const },
          { accountant_id: accountantDbId, razao_social: "Import Export SA", nome_fantasia: "Import Export", cnpj: "33.444.555/0001-66", ie: "112233445", email: "contato@impexp.com", cidade: "Belo Horizonte", uf: "MG", status: "bloqueada" as const },
          { accountant_id: accountantDbId, razao_social: "Restaurante Sabor LTDA", nome_fantasia: "Restaurante Sabor", cnpj: "44.555.666/0001-77", ie: "556677889", email: "contato@sabor.com", cidade: "Campinas", uf: "SP", status: "ativa" as const },
          { accountant_id: accountantDbId, razao_social: "Loja Virtual Pro ME", nome_fantasia: "Loja Virtual Pro", cnpj: "55.666.777/0001-88", ie: "334455667", email: "contato@lojavirtual.com", cidade: "Curitiba", uf: "PR", status: "ativa" as const },
        ];

        const { data: existingComps } = await supabase.from("companies").select("cnpj").eq("accountant_id", accountantDbId);
        const existingCnpjs = new Set((existingComps || []).map(c => c.cnpj));
        
        for (const comp of companiesData) {
          if (!existingCnpjs.has(comp.cnpj)) {
            const { data: newComp, error } = await supabase.from("companies").insert(comp).select().single();
            if (error) results.push(`Error creating company ${comp.razao_social}: ${error.message}`);
            else {
              results.push(`Created company: ${comp.razao_social} (${newComp.id})`);
              
              // Add certificate for each company
              const validade = new Date();
              validade.setMonth(validade.getMonth() + (comp.status === "bloqueada" ? -1 : 8));
              const certStatus = comp.status === "bloqueada" ? "vencido" : validade.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 ? "vencendo" : "valido";
              
              await supabase.from("company_certificates").insert({
                company_id: newComp.id,
                arquivo_nome: `Certificado_A1_${comp.nome_fantasia?.replace(/\s/g, "_")}.pfx`,
                validade: validade.toISOString().split("T")[0],
                status: certStatus,
                is_current: true,
              });
              results.push(`Created certificate for ${comp.razao_social}`);
            }
          }
        }

        // 6. Create platform charges
        const months = ["Jan/2026", "Fev/2026", "Mar/2026", "Abr/2026"];
        const { data: existingCharges } = await supabase.from("platform_charges").select("id").eq("accountant_id", accountantDbId);
        if (!existingCharges?.length) {
          for (const comp of months) {
            const isPaid = comp !== "Abr/2026";
            await supabase.from("platform_charges").insert({
              accountant_id: accountantDbId,
              competencia: comp,
              valor: 197,
              vencimento: `2026-${String(months.indexOf(comp) + 1).padStart(2, "0")}-10`,
              status: isPaid ? "pago" : "pendente",
              pago_em: isPaid ? `2026-${String(months.indexOf(comp) + 1).padStart(2, "0")}-08T00:00:00Z` : null,
              forma_pagamento: isPaid ? "pix" : "",
            });
          }
          results.push("Created platform charges");
        }

        // 7. Create company charges
        const { data: comps } = await supabase.from("companies").select("id").eq("accountant_id", accountantDbId).limit(3);
        const { data: existingCC } = await supabase.from("company_charges").select("id").eq("accountant_id", accountantDbId);
        if (!existingCC?.length && comps?.length) {
          for (const comp of comps) {
            for (const m of ["Mar/2026", "Abr/2026"]) {
              const isPaid = m === "Mar/2026";
              await supabase.from("company_charges").insert({
                company_id: comp.id,
                accountant_id: accountantDbId,
                competencia: m,
                valor: 150,
                vencimento: `2026-${m === "Mar/2026" ? "03" : "04"}-15`,
                status: isPaid ? "pago" : "pendente",
                pago_em: isPaid ? "2026-03-13T00:00:00Z" : null,
              });
            }
          }
          results.push("Created company charges");
        }

        // 8. Add some customers and products for the first company
        const { data: firstComp } = await supabase.from("companies").select("id").eq("accountant_id", accountantDbId).limit(1).single();
        if (firstComp) {
          const { data: existingCust } = await supabase.from("customers").select("id").eq("company_id", firstComp.id);
          if (!existingCust?.length) {
            await supabase.from("customers").insert([
              { company_id: firstComp.id, nome: "Cliente ABC LTDA", cpf_cnpj: "11.111.111/0001-11", email: "abc@email.com", cidade: "São Paulo", uf: "SP" },
              { company_id: firstComp.id, nome: "Maria Oliveira", cpf_cnpj: "123.456.789-00", email: "maria@email.com", cidade: "Campinas", uf: "SP" },
              { company_id: firstComp.id, nome: "Distribuidora XYZ", cpf_cnpj: "22.222.222/0001-22", email: "xyz@email.com", cidade: "Rio de Janeiro", uf: "RJ" },
            ]);
            results.push("Created customers");
          }

          const { data: existingProd } = await supabase.from("products").select("id").eq("company_id", firstComp.id);
          if (!existingProd?.length) {
            await supabase.from("products").insert([
              { company_id: firstComp.id, nome: "Notebook Dell Inspiron", ncm: "8471.30.19", unidade: "UN", preco: 4500, cfop: "5102", cst: "00" },
              { company_id: firstComp.id, nome: "Mouse Logitech MX", ncm: "8471.60.53", unidade: "UN", preco: 350, cfop: "5102", cst: "00" },
              { company_id: firstComp.id, nome: "Monitor LG 27\"", ncm: "8528.52.20", unidade: "UN", preco: 1800, cfop: "5102", cst: "00" },
              { company_id: firstComp.id, nome: "Teclado Mecânico", ncm: "8471.60.52", unidade: "UN", preco: 450, cfop: "5102", cst: "00" },
            ]);
            results.push("Created products");
          }
        }

        // 9. Audit logs
        const { data: existingLogs } = await supabase.from("audit_logs").select("id").limit(1);
        if (!existingLogs?.length && adminId) {
          await supabase.from("audit_logs").insert([
            { user_id: adminId, perfil: "admin", modulo: "contadores", acao: "Cadastro de contador", detalhes: "Cadastrou João Silva Contabilidade" },
            { user_id: adminId, perfil: "admin", modulo: "cobrancas", acao: "Geração de cobrança", detalhes: "Cobrança Abr/2026 - R$ 197,00" },
            { user_id: contadorId, perfil: "contador", modulo: "empresas", acao: "Cadastro de empresa", detalhes: "Cadastrou Tech Solutions LTDA" },
            { user_id: contadorId, perfil: "contador", modulo: "certificados", acao: "Upload de certificado", detalhes: "Certificado A1 para Tech Solutions" },
            { user_id: emissorId, perfil: "emissor", modulo: "nfe", acao: "Emissão de NF-e", detalhes: "NF-e 000142 - R$ 4.250,00" },
          ]);
          results.push("Created audit logs");
        }
      }
    }

    // Also create a second accountant without user for admin to manage
    const { data: accCount } = await supabase.from("accountants").select("id");
    if ((accCount?.length || 0) < 3) {
      await supabase.from("accountants").insert([
        { nome: "Maria Santos Assessoria", email: "maria@assessoria.com", cpf_cnpj: "98.765.432/0001-10", crc: "1RJ654321", plano: "Enterprise", status: "ativo" },
        { nome: "Carlos Oliveira Contabilidade", email: "carlos@contabil.com", cpf_cnpj: "33.444.555/0001-22", crc: "1MG789012", plano: "Starter", status: "ativo" },
        { nome: "Pedro Lima Assessoria", email: "pedro@assessoria.com", cpf_cnpj: "44.555.666/0001-33", crc: "1PR901234", plano: "Starter", status: "suspenso" },
      ]);
      results.push("Created additional accountants");
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message, results }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
