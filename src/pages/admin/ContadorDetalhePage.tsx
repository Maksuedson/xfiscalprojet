import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, CreditCard, FileText, Users, CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const contadorData: Record<string, any> = {
  "1": {
    nome: "João Silva Contabilidade", email: "joao@contabilidade.com", telefone: "(11) 99999-0001",
    cpfCnpj: "12.345.678/0001-90", crc: "SP-123456/O-7", plano: "Pro", status: "ativo", criado: "15/03/2025",
    empresas: [
      { id: "1", razaoSocial: "Tech Solutions LTDA", cnpj: "11.222.333/0001-44", status: "ativa", certificado: "válido", notas: 142, criado: "20/03/2025" },
      { id: "2", razaoSocial: "Comércio Digital ME", cnpj: "22.333.444/0001-55", status: "ativa", certificado: "vencendo", notas: 89, criado: "01/04/2025" },
      { id: "3", razaoSocial: "Import Export SA", cnpj: "33.444.555/0001-66", status: "bloqueada", certificado: "vencido", notas: 45, criado: "10/05/2025" },
    ],
    cobrancas: [
      { id: "c1", competencia: "Abr/2026", valor: "R$ 297,00", vencimento: "10/04/2026", status: "pago", pago: "08/04/2026" },
      { id: "c2", competencia: "Mar/2026", valor: "R$ 297,00", vencimento: "10/03/2026", status: "pago", pago: "09/03/2026" },
      { id: "c3", competencia: "Fev/2026", valor: "R$ 297,00", vencimento: "10/02/2026", status: "pago", pago: "10/02/2026" },
      { id: "c4", competencia: "Mai/2026", valor: "R$ 297,00", vencimento: "10/05/2026", status: "pendente", pago: "-" },
    ],
  },
};

const ContadorDetalhePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCobranca, setShowCobranca] = useState(false);
  const [novaCobranca, setNovaCobranca] = useState({ competencia: "", valor: "", vencimento: "" });

  const contador = contadorData[id || "1"] || contadorData["1"];
  const empresasAtivas = contador.empresas.filter((e: any) => e.status === "ativa").length;
  const empresasBloqueadas = contador.empresas.filter((e: any) => e.status === "bloqueada").length;
  const cobrancasPagas = contador.cobrancas.filter((c: any) => c.status === "pago").length;

  const handleGerarCobranca = () => {
    toast({ title: "Cobrança gerada", description: `Cobrança de ${novaCobranca.valor} para ${contador.nome}` });
    setShowCobranca(false);
    setNovaCobranca({ competencia: "", valor: "", vencimento: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/contadores")}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{contador.nome}</h1>
          <p className="text-muted-foreground">CRC: {contador.crc} · CNPJ: {contador.cpfCnpj} · Plano: {contador.plano}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${contador.status === "ativo" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
          {contador.status.charAt(0).toUpperCase() + contador.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total de Empresas" value={contador.empresas.length} icon={Building2} color="primary" />
        <StatCard title="Empresas Ativas" value={empresasAtivas} icon={CheckCircle} color="accent" />
        <StatCard title="Empresas Bloqueadas" value={empresasBloqueadas} icon={AlertTriangle} color="destructive" />
        <StatCard title="Cobranças Pagas" value={cobrancasPagas} icon={CreditCard} color="primary" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Empresas Vinculadas</h3>
        </div>
        <DataTable
          columns={[
            { key: "razaoSocial", header: "Razão Social" },
            { key: "cnpj", header: "CNPJ" },
            { key: "notas", header: "Notas Emitidas" },
            { key: "certificado", header: "Certificado", render: (r: any) => {
              const colors: Record<string, string> = { "válido": "bg-accent/10 text-accent", "vencendo": "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", "vencido": "bg-destructive/10 text-destructive" };
              return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[r.certificado] || ""}`}>{r.certificado}</span>;
            }},
            { key: "status", header: "Status", render: (r: any) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "ativa" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </span>
            )},
            { key: "criado", header: "Cadastro" },
          ]}
          data={contador.empresas}
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
            { key: "valor", header: "Valor" },
            { key: "vencimento", header: "Vencimento" },
            { key: "status", header: "Status", render: (r: any) => {
              const colors: Record<string, string> = { pago: "bg-accent/10 text-accent", pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", vencido: "bg-destructive/10 text-destructive" };
              return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[r.status]}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>;
            }},
            { key: "pago", header: "Pago em" },
          ]}
          data={contador.cobrancas}
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
          <DialogFooter><Button onClick={handleGerarCobranca}>Gerar Cobrança</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContadorDetalhePage;
