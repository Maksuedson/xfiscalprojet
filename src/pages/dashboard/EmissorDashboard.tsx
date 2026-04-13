import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { FileText, Receipt, DollarSign, ShieldCheck, Users, Package, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomers, useProducts, useCompanyCharges, useCertificates } from "@/hooks/useSupabaseData";

const EmissorDashboard = ({ overrideCompanyId }: { overrideCompanyId?: string }) => {
  const { user } = useAuth();
  const companyId = overrideCompanyId || user?.id_empresa;
  const { data: customers } = useCustomers(companyId);
  const { data: products } = useProducts(companyId);
  const { data: charges } = useCompanyCharges(undefined, companyId);
  const { data: certs } = useCertificates(companyId);

  const currentCert = (certs || []).find((c: any) => c.is_current);
  const certStatus = currentCert?.status || "sem certificado";
  const pendentes = (charges || []).filter((c: any) => c.status === "pendente" || c.status === "vencido");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Painel da Empresa</h1>
          <p className="text-muted-foreground">{user?.empresa || "Minha Empresa"} — Resumo operacional</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/nfe/saida"><Button><Plus size={14} className="mr-1" /> Emitir NF-e</Button></Link>
          <Link to="/dashboard/nfce"><Button variant="outline"><Plus size={14} className="mr-1" /> Emitir NFC-e</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Certificado" value={certStatus === "valido" ? "Válido" : certStatus === "vencendo" ? "Vencendo" : certStatus === "vencido" ? "Vencido" : "Pendente"} icon={ShieldCheck} color={certStatus === "valido" ? "accent" : certStatus === "vencendo" ? "warning" : "destructive"} />
        <StatCard title="Clientes" value={(customers || []).length} icon={Users} color="primary" />
        <StatCard title="Produtos" value={(products || []).length} icon={Package} color="accent" />
        <StatCard title="Cobranças Pend." value={pendentes.length} icon={Receipt} color="warning" />
        <StatCard title="Total Cobranças" value={(charges || []).length} icon={FileText} color="primary" />
        <StatCard title="Valor Pendente" value={pendentes.reduce((s: number, c: any) => s + Number(c.valor), 0)} prefix="R$ " icon={DollarSign} color="destructive" />
      </div>

      {pendentes.length > 0 && (
        <div className="bg-[hsl(45,93%,47%)]/10 border border-[hsl(45,93%,47%)]/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-[hsl(45,93%,47%)]" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Você tem {pendentes.length} cobrança(s) pendente(s)</p>
            <p className="text-xs text-muted-foreground">Verifique seus pagamentos para evitar bloqueio</p>
          </div>
          <Link to="/dashboard/mensalidades"><Button size="sm" variant="outline">Ver cobranças</Button></Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Últimos Clientes</h3>
            <Link to="/dashboard/clientes" className="text-xs text-primary hover:underline">Ver todos →</Link>
          </div>
          <DataTable
            columns={[
              { key: "nome", header: "Nome" },
              { key: "cpf_cnpj", header: "CPF/CNPJ" },
              { key: "email", header: "Email" },
            ]}
            data={(customers || []).slice(0, 5)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Últimos Produtos</h3>
            <Link to="/dashboard/produtos" className="text-xs text-primary hover:underline">Ver todos →</Link>
          </div>
          <DataTable
            columns={[
              { key: "nome", header: "Nome" },
              { key: "ncm", header: "NCM" },
              { key: "preco", header: "Preço", render: (r: any) => `R$ ${Number(r.preco).toFixed(2).replace(".", ",")}` },
            ]}
            data={(products || []).slice(0, 5)}
          />
        </div>
      </div>
    </div>
  );
};

export default EmissorDashboard;
