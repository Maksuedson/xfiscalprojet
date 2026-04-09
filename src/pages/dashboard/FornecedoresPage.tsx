import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Truck, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialFornecedores = [
  { id: 1, nome: "Distribuidora Nacional SA", cnpj: "11.222.333/0001-44", email: "contato@distnac.com", telefone: "(11) 3333-4444", cidade: "São Paulo", uf: "SP" },
  { id: 2, nome: "Importadora Global LTDA", cnpj: "55.666.777/0001-88", email: "compras@global.com", telefone: "(21) 2222-3333", cidade: "Rio de Janeiro", uf: "RJ" },
  { id: 3, nome: "Atacado Central ME", cnpj: "33.444.555/0001-22", email: "vendas@atacado.com", telefone: "(31) 4444-5555", cidade: "Belo Horizonte", uf: "MG" },
  { id: 4, nome: "Tech Parts Componentes", cnpj: "77.888.999/0001-55", email: "parts@tech.com", telefone: "(41) 5555-6666", cidade: "Curitiba", uf: "PR" },
];

const FornecedoresPage = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [fornecedores, setFornecedores] = useState(initialFornecedores);
  const [editItem, setEditItem] = useState<typeof initialFornecedores[0] | null>(null);
  const [form, setForm] = useState({ nome: "", cnpj: "", email: "", telefone: "", cidade: "", uf: "" });

  const filtered = fornecedores.filter((f) => f.nome.toLowerCase().includes(search.toLowerCase()) || f.cnpj.includes(search));

  const resetForm = () => setForm({ nome: "", cnpj: "", email: "", telefone: "", cidade: "", uf: "" });

  const handleSave = () => {
    if (!form.nome.trim() || !form.cnpj.trim()) {
      toast.error("Preencha pelo menos nome e CNPJ.");
      return;
    }
    if (editItem) {
      setFornecedores((prev) => prev.map((f) => f.id === editItem.id ? { ...f, ...form } : f));
      toast.success("Fornecedor atualizado!");
    } else {
      setFornecedores((prev) => [...prev, { id: Date.now(), ...form }]);
      toast.success("Fornecedor cadastrado!");
    }
    setOpen(false);
    setEditItem(null);
    resetForm();
  };

  const handleEdit = (item: typeof initialFornecedores[0]) => {
    setEditItem(item);
    setForm({ nome: item.nome, cnpj: item.cnpj, email: item.email, telefone: item.telefone, cidade: item.cidade, uf: item.uf });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
    toast.success("Fornecedor excluído!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Fornecedores</h1><p className="text-muted-foreground">Cadastro de fornecedores</p></div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditItem(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus size={16} className="mr-2" />Novo Fornecedor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar Fornecedor" : "Cadastrar Fornecedor"}</DialogTitle>
              <DialogDescription>Preencha os dados do fornecedor abaixo.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2 space-y-2"><Label>Razão Social</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Distribuidora XYZ" /></div>
              <div className="space-y-2"><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0001-00" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@empresa.com" /></div>
              <div className="space-y-2"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 0000-0000" /></div>
              <div className="space-y-2"><Label>Cidade</Label><Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="São Paulo" /></div>
              <div className="space-y-2"><Label>UF</Label><Input value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value })} placeholder="SP" maxLength={2} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => { setOpen(false); setEditItem(null); resetForm(); }}>Cancelar</Button>
              <Button variant="hero" onClick={handleSave}>{editItem ? "Atualizar" : "Salvar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar por nome ou CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome", header: "Razão Social", render: (r: any) => <div className="flex items-center gap-2"><Truck size={16} className="text-primary" /><span className="font-medium">{r.nome}</span></div> },
          { key: "cnpj", header: "CNPJ" },
          { key: "email", header: "Email" },
          { key: "telefone", header: "Telefone" },
          { key: "cidade", header: "Cidade" },
          { key: "uf", header: "UF" },
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

export default FornecedoresPage;
