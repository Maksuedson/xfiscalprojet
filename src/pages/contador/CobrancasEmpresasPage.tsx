import { useState } from "react";
import { DollarSign, CheckCircle, Clock, AlertTriangle, Plus, Eye, Filter, QrCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import {
  useCompanyCharges, useCreateCompanyCharge, useUpdateCompanyCharge, useCompanies
} from "@/hooks/useSupabaseData";

const statusColors: Record<string, string> = {
  pago: "bg-accent/10 text-accent",
  pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
  vencido: "bg-destructive/10 text-destructive",
};

const formatCurrency = (v: number) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;
const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("pt-BR") : "-";

const CobrancasEmpresasPage = () => {
  const { user } = useAuth();
  const { effectiveAccountantId } = useImpersonation();
  const accountantId = effectiveAccountantId || user?.id_contador;

  const { data: charges, isLoading } = useCompanyCharges(accountantId);
  const { data: companies } = useCompanies(accountantId);
  const createCharge = useCreateCompanyCharge();
  const updateCharge = useUpdateCompanyCharge();

  const [filtro, setFiltro] = useState("todos");
  const [showNova, setShowNova] = useState(false);
  const [showDetalhe, setShowDetalhe] = useState<any>(null);
  const [form, setForm] = useState({ company_id: "", competencia: "", valor: "", vencimento: "" });

  const items = (charges || []).map((c: any) => ({
    ...c,
    empresa: c.companies?.razao_social || c.companies?.nome_fantasia || "-",
  }));

  const filtered = filtro === "todos" ? items : items.filter((c: any) => c.status === filtro);
  const totalPago = items.filter((c: any) => c.status === "pago").reduce((s: number, c: any) => s + Number(c.valor), 0);
  const totalPendente = items.filter((c: any) => c.status === "pendente").reduce((s: number, c: any) => s + Number(c.valor), 0);

  const handleCriar = async () => {
    if (!form.company_id || !form.competencia || !form.valor || !form.vencimento || !accountantId) {
      toast({ title: "Preencha todos os campos", variant: "destructive" }); return;
    }
    try {
      await createCharge.mutateAsync({
        company_id: form.company_id,
        accountant_id: accountantId,
        competencia: form.competencia,
        valor: parseFloat(form.valor),
        vencimento: form.vencimento,
      });
      toast({ title: "Cobrança gerada com sucesso!" });
      setShowNova(false);
      setForm({ company_id: "", competencia: "", valor: "", vencimento: "" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const handlePago = async (id: string) => {
    await updateCharge.mutateAsync({ id, status: "pago", pago_em: new Date().toISOString(), forma_pagamento: "pix" });
    toast({ title: "Pagamento confirmado" });
    setShowDetalhe(null);
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cobranças das Empresas</h1>
          <p className="text-muted-foreground">Gestão de cobranças Contador → Empresas</p>
        </div>
        <Button onClick={() => setShowNova(true)}><Plus size={16} className="mr-2" /> Nova Cobrança</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Recebido" value={totalPago} prefix="R$ " icon={CheckCircle} color="accent" />
        <StatCard title="Pendente" value={totalPendente} prefix="R$ " icon={Clock} color="warning" />
        <StatCard title="Cobranças Pagas" value={items.filter((c: any) => c.status === "pago").length} icon={CheckCircle} color="accent" />
        <StatCard title="Total Cobranças" value={items.length} icon={DollarSign} color="primary" />
      </div>

      <div className="flex items-center gap-3">
        <Filter size={16} className="text-muted-foreground" />
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pago">Pagos</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="vencido">Vencidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={[
          { key: "empresa", header: "Empresa" },
          { key: "competencia", header: "Competência" },
          { key: "valor", header: "Valor", render: (r: any) => formatCurrency(r.valor) },
          { key: "vencimento", header: "Vencimento", render: (r: any) => formatDate(r.vencimento) },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span> },
          { key: "pago_em", header: "Pago em", render: (r: any) => formatDate(r.pago_em) },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowDetalhe(r)}><Eye size={14} /></Button>
              {r.status !== "pago" && <Button variant="ghost" size="sm" className="text-accent" onClick={() => handlePago(r.id)}><CheckCircle size={14} /></Button>}
            </div>
          )},
        ]}
        data={filtered}
      />

      {/* Modal nova cobrança */}
      <Dialog open={showNova} onOpenChange={setShowNova}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Cobrança</DialogTitle><DialogDescription>Gerar cobrança para empresa</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Empresa</Label>
              <Select value={form.company_id} onValueChange={v => setForm({ ...form, company_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {(companies || []).map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.razao_social}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Competência</Label><Input value={form.competencia} onChange={e => setForm({...form, competencia: e.target.value})} placeholder="Mai/2026" /></div>
            <div><Label>Valor (R$)</Label><Input value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="197,00" /></div>
            <div><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={e => setForm({...form, vencimento: e.target.value})} /></div>
          </div>
          <DialogFooter><Button onClick={handleCriar} disabled={createCharge.isPending}>{createCharge.isPending ? "Gerando..." : "Gerar Cobrança"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal detalhe */}
      <Dialog open={!!showDetalhe} onOpenChange={() => setShowDetalhe(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhe da Cobrança</DialogTitle><DialogDescription>Informações da cobrança</DialogDescription></DialogHeader>
          {showDetalhe && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Empresa:</span><p className="font-medium">{showDetalhe.empresa}</p></div>
              <div><span className="text-muted-foreground">Valor:</span><p className="font-medium">{formatCurrency(showDetalhe.valor)}</p></div>
              <div><span className="text-muted-foreground">Competência:</span><p className="font-medium">{showDetalhe.competencia}</p></div>
              <div><span className="text-muted-foreground">Vencimento:</span><p className="font-medium">{formatDate(showDetalhe.vencimento)}</p></div>
              <div><span className="text-muted-foreground">Status:</span><p><span className={`px-2 py-1 rounded-full text-xs ${statusColors[showDetalhe.status]}`}>{showDetalhe.status}</span></p></div>
              <div><span className="text-muted-foreground">Pago em:</span><p className="font-medium">{formatDate(showDetalhe.pago_em)}</p></div>
            </div>
          )}
          <DialogFooter>
            {showDetalhe?.status !== "pago" && <Button onClick={() => handlePago(showDetalhe.id)}>Confirmar Pagamento</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CobrancasEmpresasPage;
