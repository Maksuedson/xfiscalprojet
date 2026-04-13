import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, CreditCard, CheckCircle, AlertTriangle, Plus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAccountant, useCompanies, usePlatformCharges, useCreatePlatformCharge } from "@/hooks/useSupabaseData";

const ContadorDetalhePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCobranca, setShowCobranca] = useState(false);
  const [novaCobranca, setNovaCobranca] = useState({ competencia: "", valor: "", vencimento: "" });

  const { data: contador, isLoading: loadingContador } = useAccountant(id || "");
  const { data: allCompanies } = useCompanies();
  const { data: allCharges } = usePlatformCharges();
  const createCharge = useCreatePlatformCharge();

  const empresas = (allCompanies || []).filter((c: any) => c.accountant_id === id);
  const cobrancas = (allCharges || []).filter((c: any) => c.accountant_id === id);
  const empresasAtivas = empresas.filter((e: any) => e.status === "ativa").length;
  const empresasBloqueadas = empresas.filter((e: any) => e.status === "bloqueada").length;
  const cobrancasPagas = cobrancas.filter((c: any) => c.status === "pago").length;

  const handleGerarCobranca = async () => {
    if (!novaCobranca.competencia || !novaCobranca.valor || !novaCobranca.vencimento) {
      toast.error("Preencha todos os campos.");
      return;
    }
    try {
      await createCharge.mutateAsync({
        accountant_id: id!,
        competencia: novaCobranca.competencia,
        valor: parseFloat(novaCobranca.valor.replace(",", ".")),
        vencimento: novaCobranca.vencimento,
      });
      toast.success("Cobrança gerada com sucesso!");
      setShowCobranca(false);
      setNovaCobranca({ competencia: "", valor: "", vencimento: "" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao gerar cobrança.");
    }
  };

  if (loadingContador) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!contador) {
    return <div className="text-center py-20 text-muted-foreground">Contador não encontrado.</div>;
  }

  const statusColors: Record<string, string> = { pago: "bg-accent/10 text-accent", pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", vencido: "bg-destructive/10 text-destructive" };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/contadores")}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{contador.nome}</h1>
          <p className="text-muted-foreground">CRC: {contador.crc || "—"} · CNPJ: {contador.cpf_cnpj} · Plano: {contador.plano}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${contador.status === "ativo" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
          {contador.status.charAt(0).toUpperCase() + contador.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total de Empresas" value={empresas.length} icon={Building2} color="primary" />
        <StatCard title="Empresas Ativas" value={empresasAtivas} icon={CheckCircle} color="accent" />
        <StatCard title="Empresas Bloqueadas" value={empresasBloqueadas} icon={AlertTriangle} color="destructive" />
        <StatCard title="Cobranças Pagas" value={cobrancasPagas} icon={CreditCard} color="primary" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Empresas Vinculadas</h3>
        <DataTable
          columns={[
            { key: "razao_social", header: "Razão Social", render: (r: any) => (
              <button onClick={() => navigate(`/dashboard/empresas/${r.id}`)} className="font-medium text-primary hover:underline cursor-pointer">
                {r.nome_fantasia || r.razao_social}
              </button>
            )},
            { key: "cnpj", header: "CNPJ" },
            { key: "status", header: "Status", render: (r: any) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "ativa" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                {r.status}
              </span>
            )},
            { key: "acoes", header: "", render: (r: any) => (
              <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/empresas/${r.id}`)}>
                <LogIn size={14} className="mr-1" /> Acessar
              </Button>
            )},
          ]}
          data={empresas}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Cobranças da Plataforma</h3>
          <Button size="sm" onClick={() => setShowCobranca(true)}><Plus size={14} className="mr-1" /> Gerar Cobrança</Button>
        </div>
        <DataTable
          columns={[
            { key: "competencia", header: "Competência" },
            { key: "valor", header: "Valor", render: (r: any) => `R$ ${Number(r.valor).toFixed(2).replace(".", ",")}` },
            { key: "vencimento", header: "Vencimento", render: (r: any) => new Date(r.vencimento).toLocaleDateString("pt-BR") },
            { key: "status", header: "Status", render: (r: any) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || ""}`}>
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </span>
            )},
            { key: "pago_em", header: "Pago em", render: (r: any) => r.pago_em ? new Date(r.pago_em).toLocaleDateString("pt-BR") : "—" },
          ]}
          data={cobrancas}
        />
      </div>

      <Dialog open={showCobranca} onOpenChange={setShowCobranca}>
        <DialogContent>
          <DialogHeader><DialogTitle>Gerar Cobrança para {contador.nome}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Competência</Label><Input value={novaCobranca.competencia} onChange={(e) => setNovaCobranca({...novaCobranca, competencia: e.target.value})} placeholder="Mai/2026" /></div>
            <div><Label>Valor (R$)</Label><Input value={novaCobranca.valor} onChange={(e) => setNovaCobranca({...novaCobranca, valor: e.target.value})} placeholder="297,00" /></div>
            <div><Label>Vencimento</Label><Input type="date" value={novaCobranca.vencimento} onChange={(e) => setNovaCobranca({...novaCobranca, vencimento: e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button onClick={handleGerarCobranca} disabled={createCharge.isPending}>
              {createCharge.isPending ? "Gerando..." : "Gerar Cobrança"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContadorDetalhePage;
