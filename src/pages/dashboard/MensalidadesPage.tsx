import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import {
  usePlatformCharges, useUpdatePlatformCharge, useAccountants,
  useCompanyCharges, useUpdateCompanyCharge, useCreateCompanyCharge, useCompanies
} from "@/hooks/useSupabaseData";
import DataTable from "@/components/dashboard/DataTable";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  DollarSign, CheckCircle, Clock, AlertTriangle, Eye, Filter, Plus, Receipt
} from "lucide-react";

const statusStyle: Record<string, string> = {
  pago: "bg-accent/10 text-accent",
  pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
  vencido: "bg-destructive/10 text-destructive",
  atrasado: "bg-destructive/10 text-destructive",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[status] || statusStyle.pendente}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const formatCurrency = (v: number) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;
const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("pt-BR") : "-";

// ==================== ADMIN VIEW ====================
const AdminMensalidades = () => {
  const { data: charges, isLoading } = usePlatformCharges();
  const { data: accountants } = useAccountants();
  const updateCharge = useUpdatePlatformCharge();
  const [filtro, setFiltro] = useState("todos");
  const [detailOpen, setDetailOpen] = useState<any>(null);

  const items = (charges || []).map((c: any) => ({
    ...c,
    contador: c.accountants?.nome || "-",
    plano: c.accountants?.plano || "-",
  }));
  const filtered = filtro === "todos" ? items : items.filter((c: any) => c.status === filtro);
  const totalPago = items.filter((c: any) => c.status === "pago").reduce((s: number, c: any) => s + Number(c.valor), 0);
  const totalPendente = items.filter((c: any) => c.status === "pendente").reduce((s: number, c: any) => s + Number(c.valor), 0);
  const totalVencido = items.filter((c: any) => c.status === "vencido").reduce((s: number, c: any) => s + Number(c.valor), 0);

  const handleMarcarPago = async (id: string) => {
    await updateCharge.mutateAsync({ id, status: "pago", pago_em: new Date().toISOString(), forma_pagamento: "pix" });
    toast.success("Pagamento confirmado!");
    setDetailOpen(null);
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mensalidades da Plataforma</h1>
        <p className="text-muted-foreground">Cobranças Admin → Contadores</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Recebido" value={totalPago} prefix="R$ " icon={CheckCircle} color="accent" />
        <StatCard title="Pendente" value={totalPendente} prefix="R$ " icon={Clock} color="warning" />
        <StatCard title="Vencido" value={totalVencido} prefix="R$ " icon={AlertTriangle} color="destructive" />
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
          { key: "contador", header: "Contador" },
          { key: "plano", header: "Plano", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> },
          { key: "competencia", header: "Competência" },
          { key: "valor", header: "Valor", render: (r: any) => formatCurrency(r.valor) },
          { key: "vencimento", header: "Vencimento", render: (r: any) => formatDate(r.vencimento) },
          { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
          { key: "pago_em", header: "Pago em", render: (r: any) => formatDate(r.pago_em) },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setDetailOpen(r)}><Eye size={14} /></Button>
              {(r.status === "pendente" || r.status === "vencido") && (
                <Button variant="ghost" size="sm" className="text-accent" onClick={() => handleMarcarPago(r.id)}><CheckCircle size={14} /></Button>
              )}
            </div>
          )},
        ]}
        data={filtered}
      />

      <Dialog open={!!detailOpen} onOpenChange={() => setDetailOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhe da Mensalidade</DialogTitle><DialogDescription>Cobrança da plataforma para contador</DialogDescription></DialogHeader>
          {detailOpen && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-muted-foreground">Contador</p><p className="font-medium">{detailOpen.contador}</p></div>
              <div><p className="text-xs text-muted-foreground">Plano</p><p className="font-medium">{detailOpen.plano}</p></div>
              <div><p className="text-xs text-muted-foreground">Competência</p><p className="font-medium">{detailOpen.competencia}</p></div>
              <div><p className="text-xs text-muted-foreground">Valor</p><p className="font-bold">{formatCurrency(detailOpen.valor)}</p></div>
              <div><p className="text-xs text-muted-foreground">Vencimento</p><p className="font-medium">{formatDate(detailOpen.vencimento)}</p></div>
              <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={detailOpen.status} /></div>
              {detailOpen.pago_em && <div><p className="text-xs text-muted-foreground">Pago em</p><p className="font-medium text-accent">{formatDate(detailOpen.pago_em)}</p></div>}
            </div>
          )}
          <DialogFooter>
            {detailOpen && (detailOpen.status === "pendente" || detailOpen.status === "vencido") && (
              <Button onClick={() => handleMarcarPago(detailOpen.id)}><CheckCircle size={14} className="mr-2" />Confirmar Pagamento</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ==================== CONTADOR VIEW ====================
const ContadorMensalidades = ({ accountantId }: { accountantId: string }) => {
  const { data: platformCharges, isLoading: loadingPlatform } = usePlatformCharges(accountantId);
  const { data: companyCharges, isLoading: loadingCompany } = useCompanyCharges(accountantId);
  const { data: companies } = useCompanies(accountantId);
  const createCompanyCharge = useCreateCompanyCharge();
  const updateCompanyCharge = useUpdateCompanyCharge();

  const [filtroEmpresa, setFiltroEmpresa] = useState("todos");
  const [detailOpen, setDetailOpen] = useState<any>(null);
  const [showNova, setShowNova] = useState(false);
  const [form, setForm] = useState({ company_id: "", competencia: "", valor: "", vencimento: "" });

  // Platform charges for this contador
  const myPlatform = (platformCharges || []).map((c: any) => ({
    ...c,
    plano: c.accountants?.plano || "-",
  }));

  // Company charges
  const compCharges = (companyCharges || []).map((c: any) => ({
    ...c,
    empresa: c.companies?.razao_social || c.companies?.nome_fantasia || "-",
  }));
  const filteredCompany = filtroEmpresa === "todos" ? compCharges : compCharges.filter((c: any) => c.status === filtroEmpresa);

  const totalRecebido = compCharges.filter((c: any) => c.status === "pago").reduce((s: number, c: any) => s + Number(c.valor), 0);
  const totalPendente = compCharges.filter((c: any) => c.status === "pendente").reduce((s: number, c: any) => s + Number(c.valor), 0);
  const totalVencido = compCharges.filter((c: any) => c.status === "vencido").reduce((s: number, c: any) => s + Number(c.valor), 0);

  const handleMarcarPago = async (id: string) => {
    await updateCompanyCharge.mutateAsync({ id, status: "pago", pago_em: new Date().toISOString(), forma_pagamento: "pix" });
    toast.success("Pagamento confirmado!");
    setDetailOpen(null);
  };

  const handleCriar = async () => {
    if (!form.company_id || !form.competencia || !form.valor || !form.vencimento) {
      toast.error("Preencha todos os campos."); return;
    }
    try {
      await createCompanyCharge.mutateAsync({
        company_id: form.company_id,
        accountant_id: accountantId,
        competencia: form.competencia,
        valor: parseFloat(form.valor),
        vencimento: form.vencimento,
      });
      toast.success("Cobrança gerada!");
      setShowNova(false);
      setForm({ company_id: "", competencia: "", valor: "", vencimento: "" });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loadingPlatform || loadingCompany) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mensalidades</h1>
        <p className="text-muted-foreground">Sua mensalidade com a plataforma e cobranças das suas empresas</p>
      </div>

      {/* BLOCO 1: Mensalidade da Plataforma */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Receipt size={20} className="text-primary" />
          Minha Mensalidade (Plataforma)
        </h2>
        {myPlatform.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground">Nenhuma mensalidade da plataforma encontrada.</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <DataTable
              columns={[
                { key: "plano", header: "Plano", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> },
                { key: "competencia", header: "Competência" },
                { key: "valor", header: "Valor", render: (r: any) => formatCurrency(r.valor) },
                { key: "vencimento", header: "Vencimento", render: (r: any) => formatDate(r.vencimento) },
                { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
                { key: "pago_em", header: "Pago em", render: (r: any) => formatDate(r.pago_em) },
              ]}
              data={myPlatform}
            />
          </div>
        )}
      </div>

      {/* BLOCO 2: Cobranças das Empresas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign size={20} className="text-accent" />
            Cobranças das Minhas Empresas
          </h2>
          <Button onClick={() => setShowNova(true)}><Plus size={16} className="mr-2" />Nova Cobrança</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Recebido" value={totalRecebido} prefix="R$ " icon={CheckCircle} color="accent" />
          <StatCard title="Pendente" value={totalPendente} prefix="R$ " icon={Clock} color="warning" />
          <StatCard title="Vencido" value={totalVencido} prefix="R$ " icon={AlertTriangle} color="destructive" />
          <StatCard title="Total Cobranças" value={compCharges.length} icon={DollarSign} color="primary" />
        </div>

        <div className="flex items-center gap-3">
          <Filter size={16} className="text-muted-foreground" />
          <Select value={filtroEmpresa} onValueChange={setFiltroEmpresa}>
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
            { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
            { key: "pago_em", header: "Pago em", render: (r: any) => formatDate(r.pago_em) },
            { key: "acoes", header: "Ações", render: (r: any) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setDetailOpen(r)}><Eye size={14} /></Button>
                {(r.status === "pendente" || r.status === "vencido") && (
                  <Button variant="ghost" size="sm" className="text-accent" onClick={() => handleMarcarPago(r.id)}><CheckCircle size={14} /></Button>
                )}
              </div>
            )},
          ]}
          data={filteredCompany}
        />
      </div>

      {/* Modal nova cobrança */}
      <Dialog open={showNova} onOpenChange={setShowNova}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Cobrança para Empresa</DialogTitle><DialogDescription>Gerar cobrança mensal para uma empresa vinculada</DialogDescription></DialogHeader>
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
            <div><Label>Competência</Label><Input value={form.competencia} onChange={e => setForm({ ...form, competencia: e.target.value })} placeholder="Mai/2026" /></div>
            <div><Label>Valor (R$)</Label><Input value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="197,00" /></div>
            <div><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={e => setForm({ ...form, vencimento: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNova(false)}>Cancelar</Button>
            <Button onClick={handleCriar} disabled={createCompanyCharge.isPending}>{createCompanyCharge.isPending ? "Gerando..." : "Gerar Cobrança"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal detalhe */}
      <Dialog open={!!detailOpen} onOpenChange={() => setDetailOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhe da Cobrança</DialogTitle><DialogDescription>Cobrança de empresa</DialogDescription></DialogHeader>
          {detailOpen && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-muted-foreground">Empresa</p><p className="font-medium">{detailOpen.empresa}</p></div>
              <div><p className="text-xs text-muted-foreground">Competência</p><p className="font-medium">{detailOpen.competencia}</p></div>
              <div><p className="text-xs text-muted-foreground">Valor</p><p className="font-bold">{formatCurrency(detailOpen.valor)}</p></div>
              <div><p className="text-xs text-muted-foreground">Vencimento</p><p className="font-medium">{formatDate(detailOpen.vencimento)}</p></div>
              <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={detailOpen.status} /></div>
              {detailOpen.pago_em && <div><p className="text-xs text-muted-foreground">Pago em</p><p className="font-medium text-accent">{formatDate(detailOpen.pago_em)}</p></div>}
            </div>
          )}
          <DialogFooter>
            {detailOpen && (detailOpen.status === "pendente" || detailOpen.status === "vencido") && (
              <Button onClick={() => handleMarcarPago(detailOpen.id)}><CheckCircle size={14} className="mr-2" />Confirmar Pagamento</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ==================== EMISSOR VIEW ====================
const EmissorMensalidades = ({ companyId }: { companyId: string }) => {
  const { data: charges, isLoading } = useCompanyCharges(undefined, companyId);
  const [detailOpen, setDetailOpen] = useState<any>(null);

  const items = (charges || []).map((c: any) => ({
    ...c,
    contador: c.accountants?.nome || "-",
  }));

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minhas Mensalidades</h1>
        <p className="text-muted-foreground">Cobranças geradas pelo seu contador</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total Pago</p>
          <p className="text-2xl font-bold text-accent">{formatCurrency(items.filter((c: any) => c.status === "pago").reduce((s: number, c: any) => s + Number(c.valor), 0))}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Pendente</p>
          <p className="text-2xl font-bold text-[hsl(45,93%,47%)]">{formatCurrency(items.filter((c: any) => c.status !== "pago").reduce((s: number, c: any) => s + Number(c.valor), 0))}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Registros</p>
          <p className="text-2xl font-bold text-foreground">{items.length}</p>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "competencia", header: "Competência" },
          { key: "valor", header: "Valor", render: (r: any) => formatCurrency(r.valor) },
          { key: "vencimento", header: "Vencimento", render: (r: any) => formatDate(r.vencimento) },
          { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
          { key: "pago_em", header: "Pago em", render: (r: any) => formatDate(r.pago_em) },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <Button variant="ghost" size="sm" onClick={() => setDetailOpen(r)}><Eye size={14} /></Button>
          )},
        ]}
        data={items}
      />

      <Dialog open={!!detailOpen} onOpenChange={() => setDetailOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhe da Mensalidade</DialogTitle><DialogDescription>Informações da cobrança</DialogDescription></DialogHeader>
          {detailOpen && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-muted-foreground">Competência</p><p className="font-medium">{detailOpen.competencia}</p></div>
              <div><p className="text-xs text-muted-foreground">Valor</p><p className="font-bold">{formatCurrency(detailOpen.valor)}</p></div>
              <div><p className="text-xs text-muted-foreground">Vencimento</p><p className="font-medium">{formatDate(detailOpen.vencimento)}</p></div>
              <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={detailOpen.status} /></div>
              {detailOpen.pago_em && <div><p className="text-xs text-muted-foreground">Pago em</p><p className="font-medium text-accent">{formatDate(detailOpen.pago_em)}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ==================== MAIN DISPATCHER ====================
const MensalidadesPage = () => {
  const { user } = useAuth();
  const { effectiveRole, effectiveAccountantId, effectiveCompanyId } = useImpersonation();

  if (!user) return null;

  const role = effectiveRole;

  if (role === "admin") return <AdminMensalidades />;

  if (role === "contador") {
    const accId = effectiveAccountantId || user.id_contador;
    if (!accId) return <div className="text-center py-20 text-muted-foreground">Nenhum registro de contador vinculado.</div>;
    return <ContadorMensalidades accountantId={accId} />;
  }

  if (role === "emissor") {
    const compId = effectiveCompanyId || user.id_empresa;
    if (!compId) return <div className="text-center py-20 text-muted-foreground">Nenhuma empresa vinculada.</div>;
    return <EmissorMensalidades companyId={compId} />;
  }

  return null;
};

export default MensalidadesPage;
