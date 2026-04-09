import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Truck, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialTransportadoras = [
  { id: 1, nome: "Transportes Rápido LTDA", cnpj: "12.345.678/0001-90", rntrc: "12345678", telefone: "(11) 3333-4444", uf: "SP" },
  { id: 2, nome: "Logística Express SA", cnpj: "98.765.432/0001-10", rntrc: "87654321", telefone: "(21) 2222-3333", uf: "RJ" },
  { id: 3, nome: "Frete Seguro ME", cnpj: "55.666.777/0001-88", rntrc: "55667788", telefone: "(31) 4444-5555", uf: "MG" },
];

const TransportadorasPage = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialTransportadoras);
  const [editItem, setEditItem] = useState<typeof initialTransportadoras[0] | null>(null);
  const [form, setForm] = useState({ nome: "", cnpj: "", rntrc: "", telefone: "", uf: "" });

  const filtered = items.filter((t) => t.nome.toLowerCase().includes(search.toLowerCase()) || t.cnpj.includes(search));

  const resetForm = () => setForm({ nome: "", cnpj: "", rntrc: "", telefone: "", uf: "" });

  const handleSave = () => {
    if (!form.nome.trim() || !form.cnpj.trim()) { toast.error("Preencha pelo menos nome e CNPJ."); return; }
    if (editItem) {
      setItems((prev) => prev.map((t) => t.id === editItem.id ? { ...t, ...form } : t));
      toast.success("Transportadora atualizada!");
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...form }]);
      toast.success("Transportadora cadastrada!");
    }
    setOpen(false); setEditItem(null); resetForm();
  };

  const handleEdit = (item: typeof initialTransportadoras[0]) => {
    setEditItem(item); setForm({ nome: item.nome, cnpj: item.cnpj, rntrc: item.rntrc, telefone: item.telefone, uf: item.uf }); setOpen(true);
  };

  const handleDelete = (id: number) => { setItems((prev) => prev.filter((t) => t.id !== id)); toast.success("Transportadora excluída!"); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Transportadoras</h1><p className="text-muted-foreground">Cadastro de transportadoras</p></div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditItem(null); resetForm(); } }}>
          <DialogTrigger asChild><Button variant="hero"><Plus size={16} className="mr-2" />Nova Transportadora</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar Transportadora" : "Cadastrar Transportadora"}</DialogTitle>
              <DialogDescription>Preencha os dados da transportadora.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2 space-y-2"><Label>Razão Social</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Transportes XYZ" /></div>
              <div className="space-y-2"><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0001-00" /></div>
              <div className="space-y-2"><Label>RNTRC</Label><Input value={form.rntrc} onChange={(e) => setForm({ ...form, rntrc: e.target.value })} placeholder="00000000" /></div>
              <div className="space-y-2"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 0000-0000" /></div>
              <div className="space-y-2"><Label>UF</Label><Input value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value })} placeholder="SP" maxLength={2} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => { setOpen(false); setEditItem(null); resetForm(); }}>Cancelar</Button>
              <Button variant="hero" onClick={handleSave}>{editItem ? "Atualizar" : "Salvar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome", header: "Razão Social", render: (r: any) => <div className="flex items-center gap-2"><Truck size={16} className="text-primary" /><span className="font-medium">{r.nome}</span></div> },
          { key: "cnpj", header: "CNPJ" }, { key: "rntrc", header: "RNTRC" }, { key: "telefone", header: "Telefone" }, { key: "uf", header: "UF" },
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

export default TransportadorasPage;
