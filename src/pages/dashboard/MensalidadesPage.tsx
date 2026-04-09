import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Receipt, Plus, CheckCircle, Eye, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const initialMensalidadesAdmin = [
  { id: 1, contador: "João Silva Contabilidade", plano: "Profissional", competencia: "Abr/2026", valor: "R$ 197,00", valorNum: 197, vencimento: "10/04/2026", status: "pago", pago_em: "08/04/2026" },
  { id: 2, contador: "Maria Santos Assessoria", plano: "Enterprise", competencia: "Abr/2026", valor: "R$ 397,00", valorNum: 397, vencimento: "10/04/2026", status: "pendente", pago_em: "-" },
  { id: 3, contador: "Carlos Oliveira Cont.", plano: "Starter", competencia: "Abr/2026", valor: "R$ 97,00", valorNum: 97, vencimento: "10/04/2026", status: "pago", pago_em: "05/04/2026" },
  { id: 4, contador: "Ana Costa Contábil", plano: "Enterprise", competencia: "Mar/2026", valor: "R$ 397,00", valorNum: 397, vencimento: "10/03/2026", status: "pago", pago_em: "09/03/2026" },
  { id: 5, contador: "Pedro Lima Assessoria", plano: "Starter", competencia: "Mar/2026", valor: "R$ 97,00", valorNum: 97, vencimento: "10/03/2026", status: "atrasado", pago_em: "-" },
];

const initialMensalidadesContador = [
  { id: 1, competencia: "Abr/2026", valor: "R$ 197,00", valorNum: 197, vencimento: "10/04/2026", status: "pago", pago_em: "08/04/2026" },
  { id: 2, competencia: "Mar/2026", valor: "R$ 197,00", valorNum: 197, vencimento: "10/03/2026", status: "pago", pago_em: "09/03/2026" },
  { id: 3, competencia: "Fev/2026", valor: "R$ 197,00", valorNum: 197, vencimento: "10/02/2026", status: "pago", pago_em: "08/02/2026" },
  { id: 4, competencia: "Jan/2026", valor: "R$ 197,00", valorNum: 197, vencimento: "10/01/2026", status: "pago", pago_em: "07/01/2026" },
];

const statusStyle: Record<string, string> = {
  pago: "bg-accent/10 text-accent",
  pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
  atrasado: "bg-destructive/10 text-destructive",
};

const MensalidadesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [mensalidadesAdmin, setMensalidadesAdmin] = useState(initialMensalidadesAdmin);
  const [mensalidadesContador] = useState(initialMensalidadesContador);
  const [gerarOpen, setGerarOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState<any>(null);
  const [form, setForm] = useState({ contador: "", competencia: "", vencimento: "" });

  const handleGerar = () => {
    if (!form.contador) { toast.error("Selecione um contador."); return; }
    const planoValor: Record<string, { valor: string; valorNum: number; plano: string }> = {
      "João Silva Contabilidade": { valor: "R$ 197,00", valorNum: 197, plano: "Profissional" },
      "Maria Santos Assessoria": { valor: "R$ 397,00", valorNum: 397, plano: "Enterprise" },
      "Carlos Oliveira Cont.": { valor: "R$ 97,00", valorNum: 97, plano: "Starter" },
      "Ana Costa Contábil": { valor: "R$ 397,00", valorNum: 397, plano: "Enterprise" },
      "Pedro Lima Assessoria": { valor: "R$ 97,00", valorNum: 97, plano: "Starter" },
    };
    const info = planoValor[form.contador] || { valor: "R$ 97,00", valorNum: 97, plano: "Starter" };
    const nova = {
      id: Date.now(),
      contador: form.contador,
      plano: info.plano,
      competencia: form.competencia || "Mai/2026",
      valor: info.valor,
      valorNum: info.valorNum,
      vencimento: form.vencimento || "10/05/2026",
      status: "pendente",
      pago_em: "-",
    };
    setMensalidadesAdmin((prev) => [nova, ...prev]);
    toast.success(`Mensalidade gerada para ${form.contador}!`);
    setGerarOpen(false);
    setForm({ contador: "", competencia: "", vencimento: "" });
  };

  const handleMarcarPago = (id: number) => {
    setMensalidadesAdmin((prev) => prev.map((m) => m.id === id ? { ...m, status: "pago", pago_em: new Date().toLocaleDateString("pt-BR") } : m));
    toast.success("Pagamento confirmado!");
    setDetailOpen(null);
  };

  const data = isAdmin ? mensalidadesAdmin : mensalidadesContador;
  const totalPago = data.filter((m) => m.status === "pago").reduce((s, m) => s + m.valorNum, 0);
  const totalPendente = data.filter((m) => m.status !== "pago").reduce((s, m) => s + m.valorNum, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mensalidades</h1>
          <p className="text-muted-foreground">{isAdmin ? "Controle de mensalidades dos contadores" : "Histórico de mensalidades"}</p>
        </div>
        {isAdmin && <Button variant="hero" onClick={() => setGerarOpen(true)}><Plus size={16} className="mr-2" />Gerar Mensalidade</Button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total Recebido</p>
          <p className="text-2xl font-bold text-accent">R$ {totalPago.toLocaleString("pt-BR")}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Pendente / Atrasado</p>
          <p className="text-2xl font-bold text-[hsl(45,93%,47%)]">R$ {totalPendente.toLocaleString("pt-BR")}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Registros</p>
          <p className="text-2xl font-bold text-foreground">{data.length}</p>
        </div>
      </div>

      <DataTable
        columns={[
          ...(isAdmin ? [{ key: "contador", header: "Contador", render: (r: any) => <div className="flex items-center gap-2"><Receipt size={16} className="text-primary" /><span className="font-medium">{r.contador}</span></div> }] : []),
          ...(isAdmin ? [{ key: "plano", header: "Plano", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> }] : []),
          { key: "competencia", header: "Competência" },
          { key: "valor", header: "Valor" },
          { key: "vencimento", header: "Vencimento" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[r.status] || statusStyle.pendente}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span> },
          { key: "pago_em", header: "Pago em" },
          ...(isAdmin ? [{ key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDetailOpen(r)} title="Detalhes"><Eye size={14} /></Button>
              {r.status === "pendente" && <Button variant="outline" size="sm" onClick={() => toast.success("Lembrete enviado!")}><Send size={14} className="mr-1" />Lembrar</Button>}
              {(r.status === "pendente" || r.status === "atrasado") && <Button variant="ghost" size="sm" className="text-accent" onClick={() => handleMarcarPago(r.id)}><CheckCircle size={14} /></Button>}
            </div>
          )}] : []),
        ]}
        data={data}
      />

      {/* Modal Gerar Mensalidade */}
      <Dialog open={gerarOpen} onOpenChange={setGerarOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gerar Mensalidade</DialogTitle>
            <DialogDescription>Selecione o contador e a competência. O valor é baseado no plano contratado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Contador</Label>
              <select value={form.contador} onChange={(e) => setForm({ ...form, contador: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="">Selecione...</option>
                {initialMensalidadesAdmin.map((m) => m.contador).filter((v, i, a) => a.indexOf(v) === i).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Competência</Label><Input value={form.competencia} onChange={(e) => setForm({ ...form, competencia: e.target.value })} placeholder="Mai/2026" /></div>
              <div className="space-y-2"><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} /></div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setGerarOpen(false)}>Cancelar</Button>
            <Button variant="hero" onClick={handleGerar}>Gerar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes */}
      <Dialog open={!!detailOpen} onOpenChange={() => setDetailOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Mensalidade</DialogTitle>
            <DialogDescription>Informações completas da cobrança.</DialogDescription>
          </DialogHeader>
          {detailOpen && (
            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-3">
                {detailOpen.contador && <div><p className="text-xs text-muted-foreground">Contador</p><p className="font-medium text-foreground">{detailOpen.contador}</p></div>}
                {detailOpen.plano && <div><p className="text-xs text-muted-foreground">Plano</p><p className="font-medium text-foreground">{detailOpen.plano}</p></div>}
                <div><p className="text-xs text-muted-foreground">Competência</p><p className="font-medium text-foreground">{detailOpen.competencia}</p></div>
                <div><p className="text-xs text-muted-foreground">Valor</p><p className="font-bold text-foreground">{detailOpen.valor}</p></div>
                <div><p className="text-xs text-muted-foreground">Vencimento</p><p className="font-medium text-foreground">{detailOpen.vencimento}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><p className={`font-medium ${detailOpen.status === "pago" ? "text-accent" : detailOpen.status === "atrasado" ? "text-destructive" : "text-[hsl(45,93%,47%)]"}`}>{detailOpen.status.charAt(0).toUpperCase() + detailOpen.status.slice(1)}</p></div>
                {detailOpen.pago_em !== "-" && <div><p className="text-xs text-muted-foreground">Pago em</p><p className="font-medium text-accent">{detailOpen.pago_em}</p></div>}
              </div>
              {(detailOpen.status === "pendente" || detailOpen.status === "atrasado") && (
                <div className="flex justify-end pt-2">
                  <Button variant="hero" size="sm" onClick={() => handleMarcarPago(detailOpen.id)}><CheckCircle size={14} className="mr-2" />Confirmar Pagamento</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MensalidadesPage;
