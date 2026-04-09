import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Download, Eye, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const notasData: Record<string, any[]> = {
  entrada: [
    { numero: "000045", serie: "1", chave: "35260112345678000190550010000450001234567890", emitente: "Fornecedor XYZ SA", cnpj: "11.222.333/0001-44", valor: "R$ 12.800,00", icms: "R$ 2.304,00", ipi: "R$ 640,00", total: "R$ 15.744,00", status: "Autorizada", data: "05/04/2026", cfop: "1102", natOp: "Compra para comercialização" },
    { numero: "000044", serie: "1", chave: "35260112345678000190550010000440001234567891", emitente: "Distribuidora Nacional", cnpj: "22.333.444/0001-55", valor: "R$ 8.450,00", icms: "R$ 1.521,00", ipi: "R$ 422,50", total: "R$ 10.393,50", status: "Autorizada", data: "03/04/2026", cfop: "1102", natOp: "Compra para comercialização" },
    { numero: "000043", serie: "1", chave: "35260112345678000190550010000430001234567892", emitente: "Tech Parts LTDA", cnpj: "33.444.555/0001-66", valor: "R$ 3.200,00", icms: "R$ 576,00", ipi: "R$ 160,00", total: "R$ 3.936,00", status: "Autorizada", data: "01/04/2026", cfop: "1102", natOp: "Compra para comercialização" },
  ],
  saida: [
    { numero: "000142", serie: "1", chave: "35260112345678000190550010001420001234567893", destinatario: "Cliente ABC LTDA", cnpj: "44.555.666/0001-77", valor: "R$ 4.250,00", icms: "R$ 765,00", ipi: "R$ 0,00", total: "R$ 4.250,00", status: "Autorizada", data: "05/04/2026", cfop: "5102", natOp: "Venda de mercadoria" },
    { numero: "000141", serie: "1", chave: "35260112345678000190550010001410001234567894", destinatario: "Maria da Silva", cnpj: "123.456.789-00", valor: "R$ 1.890,00", icms: "R$ 340,20", ipi: "R$ 0,00", total: "R$ 1.890,00", status: "Autorizada", data: "04/04/2026", cfop: "5102", natOp: "Venda de mercadoria" },
    { numero: "000140", serie: "1", chave: "35260112345678000190550010001400001234567895", destinatario: "Supermercado Central", cnpj: "55.666.777/0001-88", valor: "R$ 6.320,00", icms: "R$ 1.137,60", ipi: "R$ 0,00", total: "R$ 6.320,00", status: "Autorizada", data: "03/04/2026", cfop: "5102", natOp: "Venda de mercadoria" },
    { numero: "000139", serie: "1", chave: "35260112345678000190550010001390001234567896", destinatario: "João Pereira ME", cnpj: "456.789.012-34", valor: "R$ 950,00", icms: "R$ 171,00", ipi: "R$ 0,00", total: "R$ 950,00", status: "Rejeitada", data: "02/04/2026", cfop: "5102", natOp: "Venda de mercadoria" },
  ],
  devolucao: [
    { numero: "000008", serie: "1", chave: "35260112345678000190550010000080001234567897", destinatario: "Cliente DEF ME", cnpj: "66.777.888/0001-99", valor: "R$ 1.350,00", icms: "R$ 243,00", ipi: "R$ 0,00", total: "R$ 1.350,00", status: "Autorizada", data: "03/04/2026", cfop: "5202", natOp: "Devolução de compra" },
    { numero: "000007", serie: "1", chave: "35260112345678000190550010000070001234567898", destinatario: "Comércio XY", cnpj: "77.888.999/0001-00", valor: "R$ 780,00", icms: "R$ 140,40", ipi: "R$ 0,00", total: "R$ 780,00", status: "Autorizada", data: "15/03/2026", cfop: "5202", natOp: "Devolução de compra" },
  ],
};

const tipoLabels: Record<string, string> = { entrada: "NF-e de Entrada", saida: "NF-e de Saída", devolucao: "NF-e de Devolução" };

const NFePage = () => {
  const { tipo = "saida" } = useParams<{ tipo: string }>();
  const [search, setSearch] = useState("");
  const [viewNota, setViewNota] = useState<any>(null);
  const [emitirOpen, setEmitirOpen] = useState(false);
  const [emitirForm, setEmitirForm] = useState({ destinatario: "", cnpj: "", cfop: "", natOp: "", valor: "" });

  const notas = notasData[tipo] || [];
  const parteKey = tipo === "entrada" ? "emitente" : "destinatario";
  const filtered = notas.filter((n) => (n[parteKey] || "").toLowerCase().includes(search.toLowerCase()) || n.numero.includes(search));

  const handleEmitir = () => {
    if (!emitirForm.destinatario.trim() || !emitirForm.valor.trim()) { toast.error("Preencha os campos obrigatórios."); return; }
    toast.success(`${tipoLabels[tipo]} emitida com sucesso! Nº 000${notas.length + 1}`);
    setEmitirOpen(false);
    setEmitirForm({ destinatario: "", cnpj: "", cfop: "", natOp: "", valor: "" });
  };

  const handleDownload = (nota: any) => {
    toast.success(`XML da nota ${nota.numero} baixado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">{tipoLabels[tipo] || "Notas Fiscais"}</h1><p className="text-muted-foreground">Gerenciar notas fiscais eletrônicas</p></div>
        <Button variant="hero" onClick={() => setEmitirOpen(true)}><Plus size={16} className="mr-2" />Emitir {tipoLabels[tipo]?.split(" ").pop()}</Button>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar por número ou nome..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "numero", header: "Número", render: (r: any) => <div className="flex items-center gap-2"><FileText size={16} className="text-primary" /><span className="font-medium">{r.numero}</span></div> },
          { key: "serie", header: "Série" },
          { key: parteKey, header: tipo === "entrada" ? "Emitente" : "Destinatário" },
          { key: "valor", header: "Valor" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Autorizada" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
          { key: "data", header: "Data" },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewNota(r)} title="Visualizar"><Eye size={14} /></Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownload(r)} title="Baixar XML"><Download size={14} /></Button>
            </div>
          )},
        ]}
        data={filtered}
      />

      {/* Modal Emitir */}
      <Dialog open={emitirOpen} onOpenChange={setEmitirOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Emitir {tipoLabels[tipo]}</DialogTitle>
            <DialogDescription>Preencha os dados para emissão da nota fiscal.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="sm:col-span-2 space-y-2"><Label>{tipo === "entrada" ? "Emitente" : "Destinatário"}</Label><Input value={emitirForm.destinatario} onChange={(e) => setEmitirForm({ ...emitirForm, destinatario: e.target.value })} placeholder="Nome / Razão Social" /></div>
            <div className="space-y-2"><Label>CPF/CNPJ</Label><Input value={emitirForm.cnpj} onChange={(e) => setEmitirForm({ ...emitirForm, cnpj: e.target.value })} placeholder="00.000.000/0001-00" /></div>
            <div className="space-y-2"><Label>CFOP</Label><Input value={emitirForm.cfop} onChange={(e) => setEmitirForm({ ...emitirForm, cfop: e.target.value })} placeholder={tipo === "entrada" ? "1102" : "5102"} /></div>
            <div className="space-y-2"><Label>Natureza da Operação</Label><Input value={emitirForm.natOp} onChange={(e) => setEmitirForm({ ...emitirForm, natOp: e.target.value })} placeholder={tipo === "entrada" ? "Compra para comercialização" : "Venda de mercadoria"} /></div>
            <div className="space-y-2"><Label>Valor Total</Label><Input value={emitirForm.valor} onChange={(e) => setEmitirForm({ ...emitirForm, valor: e.target.value })} placeholder="R$ 0,00" /></div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <p className="text-xs text-muted-foreground">⚠️ Em produção, a nota será transmitida à SEFAZ com certificado digital A1. Este é um ambiente de demonstração.</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEmitirOpen(false)}>Cancelar</Button>
            <Button variant="hero" onClick={handleEmitir}>Emitir Nota</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar */}
      <Dialog open={!!viewNota} onOpenChange={() => setViewNota(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da {tipoLabels[tipo]} — Nº {viewNota?.numero}</DialogTitle>
            <DialogDescription>Dados completos da nota fiscal eletrônica.</DialogDescription>
          </DialogHeader>
          {viewNota && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div><p className="text-xs text-muted-foreground">Número</p><p className="font-medium text-foreground">{viewNota.numero}</p></div>
                <div><p className="text-xs text-muted-foreground">Série</p><p className="font-medium text-foreground">{viewNota.serie}</p></div>
                <div><p className="text-xs text-muted-foreground">Data</p><p className="font-medium text-foreground">{viewNota.data}</p></div>
                <div><p className="text-xs text-muted-foreground">{tipo === "entrada" ? "Emitente" : "Destinatário"}</p><p className="font-medium text-foreground">{viewNota[parteKey]}</p></div>
                <div><p className="text-xs text-muted-foreground">CNPJ/CPF</p><p className="font-medium text-foreground">{viewNota.cnpj}</p></div>
                <div><p className="text-xs text-muted-foreground">CFOP</p><p className="font-medium text-foreground">{viewNota.cfop}</p></div>
                <div><p className="text-xs text-muted-foreground">Nat. Operação</p><p className="font-medium text-foreground">{viewNota.natOp}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><p className={`font-medium ${viewNota.status === "Autorizada" ? "text-accent" : "text-destructive"}`}>{viewNota.status}</p></div>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Valores e Impostos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div><p className="text-xs text-muted-foreground">Valor Produtos</p><p className="font-medium text-foreground">{viewNota.valor}</p></div>
                  <div><p className="text-xs text-muted-foreground">ICMS</p><p className="font-medium text-foreground">{viewNota.icms}</p></div>
                  <div><p className="text-xs text-muted-foreground">IPI</p><p className="font-medium text-foreground">{viewNota.ipi}</p></div>
                  <div><p className="text-xs text-muted-foreground">Total NF</p><p className="font-bold text-foreground">{viewNota.total}</p></div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-1">Chave de Acesso</p>
                <p className="text-xs font-mono text-foreground bg-muted/50 rounded p-2 break-all">{viewNota.chave}</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => handleDownload(viewNota)}><Download size={14} className="mr-2" />Baixar XML</Button>
                <Button variant="hero" size="sm" onClick={() => toast.success("DANFE gerado!")}>Gerar DANFE</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NFePage;
