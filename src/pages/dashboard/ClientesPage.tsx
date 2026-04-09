import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialClientes = [
  { id: 1, nome: "Cliente ABC LTDA", cpfCnpj: "12.345.678/0001-90", email: "contato@abc.com", telefone: "(11) 99999-0001", cidade: "São Paulo", uf: "SP" },
  { id: 2, nome: "Maria da Silva", cpfCnpj: "123.456.789-00", email: "maria@email.com", telefone: "(21) 98888-0002", cidade: "Rio de Janeiro", uf: "RJ" },
  { id: 3, nome: "Distribuidora Norte", cpfCnpj: "98.765.432/0001-10", email: "norte@dist.com", telefone: "(31) 97777-0003", cidade: "Belo Horizonte", uf: "MG" },
  { id: 4, nome: "João Pereira ME", cpfCnpj: "456.789.012-34", email: "joao@pereira.com", telefone: "(41) 96666-0004", cidade: "Curitiba", uf: "PR" },
  { id: 5, nome: "Supermercado Central", cpfCnpj: "55.666.777/0001-88", email: "central@super.com", telefone: "(11) 95555-0005", cidade: "Campinas", uf: "SP" },
];

const ClientesPage = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialClientes);
  const [editItem, setEditItem] = useState<typeof initialClientes[0] | null>(null);
  const [form, setForm] = useState({ nome: "", cpfCnpj: "", email: "", telefone: "", cidade: "", uf: "" });

  const filtered = items.filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpfCnpj.includes(search));
  const resetForm = () => setForm({ nome: "", cpfCnpj: "", email: "", telefone: "", cidade: "", uf: "" });

  const handleSave = () => {
    if (!form.nome.trim()) { toast.error("Informe o nome do cliente."); return; }
    if (editItem) {
      setItems((prev) => prev.map((c) => c.id === editItem.id ? { ...c, ...form } : c));
      toast.success("Cliente atualizado!");
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...form }]);
      toast.success("Cliente cadastrado!");
    }
    setOpen(false); setEditItem(null); resetForm();
  };

  const handleEdit = (item: typeof initialClientes[0]) => {
    setEditItem(item); setForm({ nome: item.nome, cpfCnpj: item.cpfCnpj, email: item.email, telefone: item.telefone, cidade: item.cidade, uf: item.uf }); setOpen(true);
  };

  const handleDelete = (id: number) => { setItems((prev) => prev.filter((c) => c.id !== id)); toast.success("Cliente excluído!"); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Clientes</h1><p className="text-muted-foreground">Cadastro de clientes para emissão de notas</p></div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditItem(null); resetForm(); } }}>
          <DialogTrigger asChild><Button variant="hero"><Plus size={16} className="mr-2" />Novo Cliente</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar Cliente" : "Cadastrar Cliente"}</DialogTitle>
              <DialogDescription>Preencha os dados do cliente.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2 space-y-2"><Label>Nome / Razão Social</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div className="space-y-2"><Label>CPF / CNPJ</Label><Input value={form.cpfCnpj} onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
              <div className="space-y-2"><Label>Cidade</Label><Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /></div>
              <div className="space-y-2"><Label>UF</Label><Input value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value })} maxLength={2} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => { setOpen(false); setEditItem(null); resetForm(); }}>Cancelar</Button>
              <Button variant="hero" onClick={handleSave}>{editItem ? "Atualizar" : "Salvar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar por nome ou CPF/CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome", header: "Nome", render: (r: any) => <div className="flex items-center gap-2"><Users size={16} className="text-primary" /><span className="font-medium">{r.nome}</span></div> },
          { key: "cpfCnpj", header: "CPF/CNPJ" }, { key: "email", header: "Email" }, { key: "telefone", header: "Telefone" }, { key: "cidade", header: "Cidade" }, { key: "uf", header: "UF" },
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

export default ClientesPage;
