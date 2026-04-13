import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, UserCheck, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAccountants, useCreateAccountant, useUpdateAccountant, useDeleteAccountant } from "@/hooks/useSupabaseData";

const ContadoresPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ nome: "", email: "", cpf_cnpj: "", crc: "", plano: "Starter", telefone: "" });

  const { data: items, isLoading } = useAccountants();
  const createMut = useCreateAccountant();
  const updateMut = useUpdateAccountant();
  const deleteMut = useDeleteAccountant();

  const filtered = (items || []).filter((c: any) =>
    c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpf_cnpj.includes(search)
  );

  const resetForm = () => setForm({ nome: "", email: "", cpf_cnpj: "", crc: "", plano: "Starter", telefone: "" });

  const planoValor: Record<string, string> = { Starter: "R$ 97,00", Pro: "R$ 197,00", Enterprise: "R$ 397,00" };

  const handleSave = async () => {
    if (!form.nome.trim() || !form.cpf_cnpj.trim()) { toast.error("Preencha pelo menos nome e CPF/CNPJ."); return; }
    try {
      if (editItem) {
        await updateMut.mutateAsync({ id: editItem.id, ...form });
        toast.success("Contador atualizado!");
      } else {
        await createMut.mutateAsync(form);
        toast.success("Contador cadastrado!");
      }
      setOpen(false); setEditItem(null); resetForm();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar.");
    }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ nome: item.nome, email: item.email, cpf_cnpj: item.cpf_cnpj, crc: item.crc || "", plano: item.plano, telefone: item.telefone || "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Contador excluído!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir.");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Contadores</h1><p className="text-muted-foreground">Gerenciar contadores cadastrados</p></div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditItem(null); resetForm(); } }}>
          <DialogTrigger asChild><Button variant="hero"><Plus size={16} className="mr-2" />Novo Contador</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar Contador" : "Cadastrar Contador"}</DialogTitle>
              <DialogDescription>Preencha os dados do contador.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2 space-y-2"><Label>Nome / Razão Social</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Silva Contabilidade" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@empresa.com" /></div>
              <div className="space-y-2"><Label>CPF/CNPJ</Label><Input value={form.cpf_cnpj} onChange={(e) => setForm({ ...form, cpf_cnpj: e.target.value })} placeholder="00.000.000/0001-00" /></div>
              <div className="space-y-2"><Label>CRC</Label><Input value={form.crc} onChange={(e) => setForm({ ...form, crc: e.target.value })} placeholder="1SP000000" /></div>
              <div className="space-y-2"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(11) 99999-0000" /></div>
              <div className="space-y-2">
                <Label>Plano</Label>
                <select value={form.plano} onChange={(e) => setForm({ ...form, plano: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="Starter">Starter — R$ 97/mês</option>
                  <option value="Pro">Pro — R$ 197/mês</option>
                  <option value="Enterprise">Enterprise — R$ 397/mês</option>
                </select>
              </div>
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
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome", header: "Nome", render: (r: any) => <div className="flex items-center gap-2"><UserCheck size={16} className="text-primary" /><button onClick={() => navigate(`/dashboard/contadores/${r.id}`)} className="font-medium text-primary hover:underline cursor-pointer">{r.nome}</button></div> },
          { key: "cpf_cnpj", header: "CPF/CNPJ" },
          { key: "crc", header: "CRC" },
          { key: "plano", header: "Plano", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> },
          { key: "valorMensalidade", header: "Mensalidade", render: (r: any) => planoValor[r.plano] || "-" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "ativo" ? "bg-accent/10 text-accent" : r.status === "suspenso" ? "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
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

export default ContadoresPage;
