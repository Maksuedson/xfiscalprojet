import { useState } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle, Clock, Upload, Eye, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const initialCertificados = [
  { id: "1", empresa: "Tech Solutions LTDA", cnpj: "11.222.333/0001-44", arquivo: "cert_tech_2026.pfx", validade: "15/12/2026", status: "válido", uploadEm: "10/01/2026", historico: [
    { data: "10/01/2026", acao: "Upload inicial", arquivo: "cert_tech_2026.pfx" },
  ]},
  { id: "2", empresa: "Comércio Digital ME", cnpj: "22.333.444/0001-55", arquivo: "cert_comercio_2026.pfx", validade: "20/06/2026", status: "vencendo", uploadEm: "15/06/2025", historico: [
    { data: "15/06/2025", acao: "Upload inicial", arquivo: "cert_comercio_2025.pfx" },
    { data: "15/06/2025", acao: "Renovação", arquivo: "cert_comercio_2026.pfx" },
  ]},
  { id: "3", empresa: "Import Export SA", cnpj: "33.444.555/0001-66", arquivo: "cert_import_2025.pfx", validade: "01/03/2026", status: "vencido", uploadEm: "01/03/2025", historico: [
    { data: "01/03/2025", acao: "Upload inicial", arquivo: "cert_import_2025.pfx" },
  ]},
  { id: "4", empresa: "Loja Virtual Pro", cnpj: "44.555.666/0001-77", arquivo: "-", validade: "-", status: "sem certificado", uploadEm: "-", historico: [] },
  { id: "5", empresa: "Restaurante Sabor", cnpj: "55.666.777/0001-88", arquivo: "cert_restaurante_2027.pfx", validade: "10/01/2027", status: "válido", uploadEm: "10/01/2026", historico: [
    { data: "10/01/2026", acao: "Upload inicial", arquivo: "cert_restaurante_2027.pfx" },
  ]},
];

const CertificadosPage = () => {
  const [certificados] = useState(initialCertificados);
  const [showUpload, setShowUpload] = useState<any>(null);
  const [showHistorico, setShowHistorico] = useState<any>(null);

  const validos = certificados.filter(c => c.status === "válido").length;
  const vencendo = certificados.filter(c => c.status === "vencendo").length;
  const vencidos = certificados.filter(c => c.status === "vencido").length;
  const sem = certificados.filter(c => c.status === "sem certificado").length;

  const statusColors: Record<string, string> = {
    "válido": "bg-accent/10 text-accent",
    "vencendo": "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
    "vencido": "bg-destructive/10 text-destructive",
    "sem certificado": "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Certificados Digitais A1</h1>
        <p className="text-muted-foreground">Gestão de certificados por empresa</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Válidos" value={validos} icon={CheckCircle} color="accent" />
        <StatCard title="Vencendo em breve" value={vencendo} icon={Clock} color="warning" />
        <StatCard title="Vencidos" value={vencidos} icon={AlertTriangle} color="destructive" />
        <StatCard title="Sem certificado" value={sem} icon={ShieldCheck} color="primary" />
      </div>

      {vencendo > 0 && (
        <div className="bg-[hsl(45,93%,47%)]/10 border border-[hsl(45,93%,47%)]/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-[hsl(45,93%,47%)]" size={20} />
          <p className="text-sm text-foreground"><strong>{vencendo} certificado(s)</strong> vencem nos próximos 90 dias. Atualize antes do vencimento.</p>
        </div>
      )}

      {vencidos > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-destructive" size={20} />
          <p className="text-sm text-foreground"><strong>{vencidos} certificado(s)</strong> estão vencidos. A emissão de notas está bloqueada para essas empresas.</p>
        </div>
      )}

      <DataTable
        columns={[
          { key: "empresa", header: "Empresa" },
          { key: "cnpj", header: "CNPJ" },
          { key: "arquivo", header: "Arquivo" },
          { key: "validade", header: "Validade" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span> },
          { key: "uploadEm", header: "Upload em" },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowUpload(r)} title="Upload novo certificado"><Upload size={14} /></Button>
              <Button variant="ghost" size="sm" onClick={() => setShowHistorico(r)} title="Histórico" disabled={r.historico.length === 0}><History size={14} /></Button>
            </div>
          )},
        ]}
        data={certificados}
      />

      {/* Modal upload */}
      <Dialog open={!!showUpload} onOpenChange={() => setShowUpload(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload de Certificado A1</DialogTitle>
            <DialogDescription>{showUpload?.empresa}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Arquivo do Certificado (.pfx / .p12)</Label><Input type="file" accept=".pfx,.p12" /></div>
            <div><Label>Senha do Certificado</Label><Input type="password" placeholder="Digite a senha do certificado" /></div>
            {showUpload?.status !== "sem certificado" && (
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                <p><strong>Certificado atual:</strong> {showUpload?.arquivo}</p>
                <p><strong>Validade:</strong> {showUpload?.validade}</p>
                <p className="mt-1">O certificado atual só será substituído após validação do novo.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => { toast({ title: "Certificado atualizado", description: `Certificado de ${showUpload?.empresa} validado e salvo.` }); setShowUpload(null); }}>
              Validar e Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal histórico */}
      <Dialog open={!!showHistorico} onOpenChange={() => setShowHistorico(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de Certificados</DialogTitle>
            <DialogDescription>{showHistorico?.empresa}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {showHistorico?.historico.map((h: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{h.acao}</p>
                  <p className="text-xs text-muted-foreground">{h.arquivo} — {h.data}</p>
                </div>
              </div>
            ))}
            {showHistorico?.historico.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum histórico disponível</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificadosPage;
