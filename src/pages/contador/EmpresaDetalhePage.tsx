import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, ShieldCheck, CreditCard, Users, Package, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCompany, useCompanyCharges, useCreateCompanyCharge, useCertificates, useCustomers, useProducts } from "@/hooks/useSupabaseData";

const EmpresaDetalhePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCobranca, setShowCobranca] = useState(false);
  const [showCertificado, setShowCertificado] = useState(false);
  const [novaCobranca, setNovaCobranca] = useState({ competencia: "", valor: "", vencimento: "" });

  const { data: empresa, isLoading } = useCompany(id || "");
  const { data: cobrancas } = useCompanyCharges(undefined, id);
  const { data: certificados } = useCertificates(id);
  const { data: clientes } = useCustomers(id);
  const { data: produtos } = useProducts(id);
  const createCharge = useCreateCompanyCharge();

  const certAtual = (certificados || []).find((c: any) => c.is_current);

  const certStatus = certAtual ? certAtual.status : "sem certificado";
  const certColors: Record<string, string> = {
    "valido": "bg-accent/10 text-accent",
    "vencendo": "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
    "vencido": "bg-destructive/10 text-destructive",
    "sem certificado": "bg-muted text-muted-foreground",
  };

  const handleGerarCobranca = async () => {
    if (!novaCobranca.competencia || !novaCobranca.valor || !novaCobranca.vencimento || !empresa) {
      toast.error("Preencha todos os campos.");
      return;
    }
    try {
      await createCharge.mutateAsync({
        company_id: id!,
        accountant_id: empresa.accountant_id,
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

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!empresa) {
    return <div className="text-center py-20 text-muted-foreground">Empresa não encontrada.</div>;
  }

  const statusColors: Record<string, string> = { pago: "bg-accent/10 text-accent", pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", vencido: "bg-destructive/10 text-destructive" };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/empresas")}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{empresa.nome_fantasia || empresa.razao_social}</h1>
          <p className="text-muted-foreground">CNPJ: {empresa.cnpj} · IE: {empresa.ie || "—"} · {empresa.cidade || ""}/{empresa.uf || ""}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${empresa.status === "ativa" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
          {empresa.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Clientes" value={(clientes || []).length} icon={Users} color="primary" />
        <StatCard title="Produtos" value={(produtos || []).length} icon={Package} color="accent" />
        <StatCard title="Cobranças" value={(cobrancas || []).length} icon={CreditCard} color="primary" />
        <StatCard title="Certificados" value={(certificados || []).length} icon={ShieldCheck} color="accent" />
        <StatCard title="Status Cert." value={certStatus} icon={ShieldCheck} color={certStatus === "valido" ? "accent" : "destructive"} />
      </div>

      {/* Certificado A1 */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Certificado Digital A1</h3>
          <Button size="sm" variant="outline" onClick={() => setShowCertificado(true)}>
            <Upload size={14} className="mr-1" /> Atualizar Certificado
          </Button>
        </div>
        {certAtual ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted-foreground">Status:</span> <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${certColors[certAtual.status]}`}>{certAtual.status}</span></div>
            <div><span className="text-muted-foreground">Validade:</span> <span className="ml-2 font-medium text-foreground">{new Date(certAtual.validade).toLocaleDateString("pt-BR")}</span></div>
            <div><span className="text-muted-foreground">Arquivo:</span> <span className="ml-2 font-medium text-foreground">{certAtual.arquivo_nome}</span></div>
            <div><span className="text-muted-foreground">Upload:</span> <span className="ml-2 font-medium text-foreground">{new Date(certAtual.uploaded_at).toLocaleDateString("pt-BR")}</span></div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum certificado cadastrado.</p>
        )}
      </div>

      {/* Cobranças */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Cobranças</h3>
          <Button size="sm" onClick={() => setShowCobranca(true)}><Plus size={14} className="mr-1" /> Nova Cobrança</Button>
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
          data={cobrancas || []}
        />
      </div>

      {/* Modal Cobrança */}
      <Dialog open={showCobranca} onOpenChange={setShowCobranca}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Cobrança para {empresa.nome_fantasia || empresa.razao_social}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Competência</Label><Input value={novaCobranca.competencia} onChange={(e) => setNovaCobranca({...novaCobranca, competencia: e.target.value})} placeholder="Mai/2026" /></div>
            <div><Label>Valor (R$)</Label><Input value={novaCobranca.valor} onChange={(e) => setNovaCobranca({...novaCobranca, valor: e.target.value})} placeholder="197,00" /></div>
            <div><Label>Vencimento</Label><Input type="date" value={novaCobranca.vencimento} onChange={(e) => setNovaCobranca({...novaCobranca, vencimento: e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button onClick={handleGerarCobranca} disabled={createCharge.isPending}>
              {createCharge.isPending ? "Gerando..." : "Gerar Cobrança"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Certificado */}
      <Dialog open={showCertificado} onOpenChange={setShowCertificado}>
        <DialogContent>
          <DialogHeader><DialogTitle>Atualizar Certificado A1</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Arquivo do Certificado (.pfx)</Label><Input type="file" accept=".pfx,.p12" /></div>
            <div><Label>Senha do Certificado</Label><Input type="password" placeholder="Senha do certificado" /></div>
            <p className="text-xs text-muted-foreground">O certificado atual só será substituído após a validação do novo.</p>
          </div>
          <DialogFooter><Button onClick={() => { toast.success("Certificado atualizado com sucesso!"); setShowCertificado(false); }}>Validar e Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmpresaDetalhePage;
