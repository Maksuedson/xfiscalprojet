import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Receipt, Download, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const nfces = [
  { numero: "000892", serie: "1", consumidor: "Consumidor Final", cpf: "", valor: "R$ 89,90", formaPgto: "Dinheiro", status: "Autorizada", data: "05/04/2026 14:32", chave: "35260112345678000190650010008920001234567890" },
  { numero: "000891", serie: "1", consumidor: "Consumidor Final", cpf: "", valor: "R$ 156,50", formaPgto: "Cartão Débito", status: "Autorizada", data: "05/04/2026 11:15", chave: "35260112345678000190650010008910001234567891" },
  { numero: "000890", serie: "1", consumidor: "João Silva", cpf: "123.456.789-00", valor: "R$ 342,00", formaPgto: "PIX", status: "Autorizada", data: "04/04/2026 16:45", chave: "35260112345678000190650010008900001234567892" },
  { numero: "000889", serie: "1", consumidor: "Consumidor Final", cpf: "", valor: "R$ 67,80", formaPgto: "Dinheiro", status: "Rejeitada", data: "04/04/2026 10:22", chave: "35260112345678000190650010008890001234567893" },
  { numero: "000888", serie: "1", consumidor: "Maria Santos", cpf: "987.654.321-00", valor: "R$ 1.250,00", formaPgto: "Cartão Crédito", status: "Autorizada", data: "03/04/2026 15:30", chave: "35260112345678000190650010008880001234567894" },
];

const NFCePage = () => {
  const [search, setSearch] = useState("");
  const [viewNota, setViewNota] = useState<any>(null);
  const [emitirOpen, setEmitirOpen] = useState(false);
  const [form, setForm] = useState({ consumidor: "", cpf: "", valor: "", formaPgto: "Dinheiro" });
  const filtered = nfces.filter((n) => n.consumidor.toLowerCase().includes(search.toLowerCase()) || n.numero.includes(search));

  const handleEmitir = () => {
    if (!form.valor.trim()) { toast.error("Informe o valor da venda."); return; }
    toast.success(`NFC-e emitida com sucesso! Nº 000${nfces.length + 1}`);
    setEmitirOpen(false);
    setForm({ consumidor: "", cpf: "", valor: "", formaPgto: "Dinheiro" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">NFC-e</h1><p className="text-muted-foreground">Nota Fiscal de Consumidor Eletrônica</p></div>
        <Button variant="hero" onClick={() => setEmitirOpen(true)}><Plus size={16} className="mr-2" />Emitir NFC-e</Button>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "numero", header: "Número", render: (r: any) => <div className="flex items-center gap-2"><Receipt size={16} className="text-primary" /><span className="font-medium">{r.numero}</span></div> },
          { key: "serie", header: "Série" }, { key: "consumidor", header: "Consumidor" }, { key: "valor", header: "Valor" },
          { key: "formaPgto", header: "Pagamento" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Autorizada" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
          { key: "data", header: "Data/Hora" },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewNota(r)} title="Visualizar"><Eye size={14} /></Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toast.success(`XML da NFC-e ${r.numero} baixado!`)} title="Baixar XML"><Download size={14} /></Button>
            </div>
          )},
        ]}
        data={filtered}
      />

      {/* Modal Emitir */}
      <Dialog open={emitirOpen} onOpenChange={setEmitirOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Emitir NFC-e</DialogTitle>
            <DialogDescription>Preencha os dados da venda ao consumidor.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2"><Label>Consumidor (opcional)</Label><Input value={form.consumidor} onChange={(e) => setForm({ ...form, consumidor: e.target.value })} placeholder="Consumidor Final" /></div>
            <div className="space-y-2"><Label>CPF (opcional)</Label><Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" /></div>
            <div className="space-y-2"><Label>Valor Total</Label><Input value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="R$ 0,00" /></div>
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <select value={form.formaPgto} onChange={(e) => setForm({ ...form, formaPgto: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option>Dinheiro</option><option>Cartão Crédito</option><option>Cartão Débito</option><option>PIX</option>
              </select>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <p className="text-xs text-muted-foreground">⚠️ Ambiente de demonstração. Em produção a nota será transmitida à SEFAZ.</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEmitirOpen(false)}>Cancelar</Button>
            <Button variant="hero" onClick={handleEmitir}>Emitir NFC-e</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar */}
      <Dialog open={!!viewNota} onOpenChange={() => setViewNota(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>NFC-e Nº {viewNota?.numero}</DialogTitle>
            <DialogDescription>Detalhes da nota fiscal de consumidor.</DialogDescription>
          </DialogHeader>
          {viewNota && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Número</p><p className="font-medium text-foreground">{viewNota.numero}</p></div>
                <div><p className="text-xs text-muted-foreground">Série</p><p className="font-medium text-foreground">{viewNota.serie}</p></div>
                <div><p className="text-xs text-muted-foreground">Data/Hora</p><p className="font-medium text-foreground">{viewNota.data}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><p className={`font-medium ${viewNota.status === "Autorizada" ? "text-accent" : "text-destructive"}`}>{viewNota.status}</p></div>
                <div><p className="text-xs text-muted-foreground">Consumidor</p><p className="font-medium text-foreground">{viewNota.consumidor}</p></div>
                <div><p className="text-xs text-muted-foreground">CPF</p><p className="font-medium text-foreground">{viewNota.cpf || "Não informado"}</p></div>
                <div><p className="text-xs text-muted-foreground">Valor</p><p className="font-bold text-foreground">{viewNota.valor}</p></div>
                <div><p className="text-xs text-muted-foreground">Pagamento</p><p className="font-medium text-foreground">{viewNota.formaPgto}</p></div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-1">Chave de Acesso</p>
                <p className="text-xs font-mono text-foreground bg-muted/50 rounded p-2 break-all">{viewNota.chave}</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => toast.success(`XML baixado!`)}><Download size={14} className="mr-2" />Baixar XML</Button>
                <Button variant="hero" size="sm" onClick={() => toast.success("DANFCE gerado!")}>Gerar DANFCE</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NFCePage;
