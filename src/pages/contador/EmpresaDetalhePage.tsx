import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, ShieldCheck, CreditCard, Users, Package, Clock, CheckCircle, AlertTriangle, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const empresaData: Record<string, any> = {
  "1": {
    razaoSocial: "Tech Solutions LTDA", nomeFantasia: "Tech Solutions", cnpj: "11.222.333/0001-44",
    ie: "123.456.789.001", email: "contato@tech.com", telefone: "(11) 3333-4444",
    endereco: "Rua da Tecnologia, 100", cidade: "São Paulo", uf: "SP", status: "ativa",
    certificado: { status: "válido", validade: "15/12/2026", arquivo: "cert_tech_2026.pfx", uploadEm: "10/01/2026" },
    notas: { total: 142, entrada: 35, saida: 82, devolucao: 5, nfce: 20 },
    ultimasNotas: [
      { numero: "000142", tipo: "NF-e Saída", dest: "Cliente ABC", valor: "R$ 4.250,00", status: "Autorizada", data: "05/04/2026" },
      { numero: "000141", tipo: "NFC-e", dest: "Consumidor Final", valor: "R$ 89,90", status: "Autorizada", data: "05/04/2026" },
      { numero: "000140", tipo: "NF-e Entrada", dest: "Fornecedor XYZ", valor: "R$ 12.800,00", status: "Autorizada", data: "04/04/2026" },
    ],
    cobrancas: [
      { competencia: "Abr/2026", valor: "R$ 197,00", vencimento: "15/04/2026", status: "pago", pago: "14/04/2026" },
      { competencia: "Mai/2026", valor: "R$ 197,00", vencimento: "15/05/2026", status: "pendente", pago: "-" },
    ],
    clientes: 28, produtos: 85,
  },
};

const EmpresaDetalhePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCobranca, setShowCobranca] = useState(false);
  const [showCertificado, setShowCertificado] = useState(false);
  const [novaCobranca, setNovaCobranca] = useState({ competencia: "", valor: "", vencimento: "" });

  const empresa = empresaData[id || "1"] || empresaData["1"];

  const certColors: Record<string, string> = { "válido": "bg-accent/10 text-accent", "vencendo": "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", "vencido": "bg-destructive/10 text-destructive" };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/empresas")}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{empresa.razaoSocial}</h1>
          <p className="text-muted-foreground">CNPJ: {empresa.cnpj} · IE: {empresa.ie} · {empresa.cidade}/{empresa.uf}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${empresa.status === "ativa" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
          {empresa.status.charAt(0).toUpperCase() + empresa.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Notas Emitidas" value={empresa.notas.total} icon={FileText} color="primary" />
        <StatCard title="NF-e Saída" value={empresa.notas.saida} icon={FileText} color="accent" />
        <StatCard title="NF-e Entrada" value={empresa.notas.entrada} icon={FileText} color="primary" />
        <StatCard title="Clientes" value={empresa.clientes} icon={Users} color="primary" />
        <StatCard title="Produtos" value={empresa.produtos} icon={Package} color="accent" />
        <StatCard title="Certificado" value={empresa.certificado.status} icon={ShieldCheck} color={empresa.certificado.status === "válido" ? "accent" : "destructive"} />
      </div>

      {/* Certificado A1 */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Certificado Digital A1</h3>
          <Button size="sm" variant="outline" onClick={() => setShowCertificado(true)}><Upload size={14} className="mr-1" /> Atualizar Certificado</Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-muted-foreground">Status:</span> <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${certColors[empresa.certificado.status]}`}>{empresa.certificado.status}</span></div>
          <div><span className="text-muted-foreground">Validade:</span> <span className="ml-2 font-medium text-foreground">{empresa.certificado.validade}</span></div>
          <div><span className="text-muted-foreground">Arquivo:</span> <span className="ml-2 font-medium text-foreground">{empresa.certificado.arquivo}</span></div>
          <div><span className="text-muted-foreground">Upload em:</span> <span className="ml-2 font-medium text-foreground">{empresa.certificado.uploadEm}</span></div>
        </div>
      </div>

      {/* Últimas notas */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Últimas Notas Fiscais</h3>
        <DataTable
          columns={[
            { key: "numero", header: "Número" },
            { key: "tipo", header: "Tipo", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.tipo}</span> },
            { key: "dest", header: "Destinatário" },
            { key: "valor", header: "Valor" },
            { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Autorizada" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
            { key: "data", header: "Data" },
          ]}
          data={empresa.ultimasNotas}
        />
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
            { key: "valor", header: "Valor" },
            { key: "vencimento", header: "Vencimento" },
            { key: "status", header: "Status", render: (r: any) => {
              const c: Record<string, string> = { pago: "bg-accent/10 text-accent", pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", vencido: "bg-destructive/10 text-destructive" };
              return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c[r.status]}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>;
            }},
            { key: "pago", header: "Pago em" },
          ]}
          data={empresa.cobrancas}
        />
      </div>

      {/* Modal Cobrança */}
      <Dialog open={showCobranca} onOpenChange={setShowCobranca}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Cobrança para {empresa.razaoSocial}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Competência</Label><Input value={novaCobranca.competencia} onChange={(e) => setNovaCobranca({...novaCobranca, competencia: e.target.value})} placeholder="Mai/2026" /></div>
            <div><Label>Valor (R$)</Label><Input value={novaCobranca.valor} onChange={(e) => setNovaCobranca({...novaCobranca, valor: e.target.value})} placeholder="197,00" /></div>
            <div><Label>Vencimento</Label><Input type="date" value={novaCobranca.vencimento} onChange={(e) => setNovaCobranca({...novaCobranca, vencimento: e.target.value})} /></div>
          </div>
          <DialogFooter><Button onClick={() => { toast({ title: "Cobrança gerada com sucesso" }); setShowCobranca(false); }}>Gerar Cobrança</Button></DialogFooter>
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
          <DialogFooter><Button onClick={() => { toast({ title: "Certificado atualizado com sucesso" }); setShowCertificado(false); }}>Validar e Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmpresaDetalhePage;
