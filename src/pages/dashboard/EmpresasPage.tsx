import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Building2, Pencil, Trash2, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany, useAccountants } from "@/hooks/useSupabaseData";

const EmpresasPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const accountantId = user?.role === "contador" ? user.id_contador : undefined;

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ razao_social: "", nome_fantasia: "", cnpj: "", ie: "", email: "", telefone: "", endereco: "", cidade: "", uf: "", accountant_id: "" });

  const { data: items, isLoading } = useCompanies(accountantId);
  const { data: accountants } = useAccountants();
  const createMut = useCreateCompany();
  const updateMut = useUpdateCompany();
  const deleteMut = useDeleteCompany();

  const filtered = (items || []).filter((e: any) =>
    (e.nome_fantasia || e.razao_social).toLowerCase().includes(search.toLowerCase()) || e.cnpj.includes(search)
  );

  const resetForm = () => setForm({ razao_social: "", nome_fantasia: "", cnpj: "", ie: "", email: "", telefone: "", endereco: "", cidade: "", uf: "", accountant_id: accountantId || "" });

  const handleSave = async () => {
    if (!form.razao_social.trim() || !form.cnpj.trim()) { toast.error("Preencha razão social e CNPJ."); return; }
    if (!form.accountant_id && !accountantId) { toast.error("Selecione o contador."); return; }
    try {
      const payload = { ...form, accountant_id: form.accountant_id || accountantId! };
      if (editItem) {
        await updateMut.mutateAsync({ id: editItem.id, ...payload });
        toast.success("Empresa atualizada!");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Empresa cadastrada!");
      }
      setOpen(false); setEditItem(null); resetForm();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar.");
    }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ razao_social: item.razao_social, nome_fantasia: item.nome_fantasia || "", cnpj: item.cnpj, ie: item.ie || "", email: item.email || "", telefone: item.telefone || "", endereco: item.endereco || "", cidade: item.cidade || "", uf: item.uf || "", accountant_id: item.accountant_id });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try { await deleteMut.mutateAsync(id); toast.success("Empresa excluída!"); }
    catch (err: any) { toast.error(err.message || "Erro ao excluir."); }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Empresas</h1><p className="text-muted-foreground">Gerencie as empresas cadastradas</p></div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditItem(null); resetForm(); } }}>
          <DialogTrigger asChild><Button variant="hero"><Plus size={16} className="mr-2" />Nova Empresa</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar Empresa" : "Cadastrar Empresa"}</DialogTitle>
              <DialogDescription>Preencha os dados da empresa.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2 space-y-2"><Label>Razão Social</Label><Input value={form.razao_social} onChange={(e) => setForm({ ...form, razao_social: e.target.value })} placeholder="Ex: Minha Empresa LTDA" /></div>
              <div className="space-y-2"><Label>Nome Fantasia</Label><Input value={form.nome_fantasia} onChange={(e) => setForm({ ...form, nome_fantasia: e.target.value })} /></div>
              <div className="space-y-2"><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0001-00" /></div>
              <div className="space-y-2"><Label>Inscrição Estadual</Label><Input value={form.ie} onChange={(e) => setForm({ ...form, ie: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
              <div className="space-y-2"><Label>Endereço</Label><Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /></div>
              <div className="space-y-2"><Label>Cidade</Label><Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /></div>
              <div className="space-y-2"><Label>UF</Label><Input value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value })} maxLength={2} /></div>
              {isAdmin && (
                <div className="space-y-2">
                  <Label>Contador</Label>
                  <select value={form.accountant_id} onChange={(e) => setForm({ ...form, accountant_id: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="">Selecione...</option>
                    {(accountants || []).map((a: any) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => { setOpen(false); setEditItem(null); resetForm(); }}>Cancelar</Button>
              <Button variant="hero" onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>
                {(createMut.isPending || updateMut.isPending) ? "Salvando..." : editItem ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar por nome ou CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome_fantasia", header: "Nome", render: (r: any) => <div className="flex items-center gap-2"><Building2 size={16} className="text-primary" /><button onClick={() => navigate(`/dashboard/empresas/${r.id}`)} className="font-medium text-primary hover:underline cursor-pointer">{r.nome_fantasia || r.razao_social}</button></div> },
          { key: "cnpj", header: "CNPJ" },
          { key: "ie", header: "IE" },
          { key: "uf", header: "UF" },
          { key: "cidade", header: "Cidade" },
          ...(isAdmin ? [{ key: "accountants", header: "Contador", render: (r: any) => r.accountants?.nome || "-" }] : []),
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "ativa" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => navigate(`/dashboard/empresas/${r.id}`)}><LogIn size={14} className="mr-1" />Acessar</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(r)}><Pencil size={14} /></Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete(r.id)}><Trash2 size={14} /></Button>
            </div>
          )},
        ]}
        data={filtered}
      />
    </div>
  );
};

export default EmpresasPage;
