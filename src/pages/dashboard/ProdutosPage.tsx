import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Package, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialProdutos = [
  { id: 1, nome: "Notebook Dell Inspiron 15", ncm: "8471.30.19", cfop: "5102", un: "UN", valor: "R$ 3.499,00", estoque: 45 },
  { id: 2, nome: "Mouse sem fio Logitech", ncm: "8471.60.53", cfop: "5102", un: "UN", valor: "R$ 89,90", estoque: 230 },
  { id: 3, nome: "Teclado mecânico RGB", ncm: "8471.60.52", cfop: "5102", un: "UN", valor: "R$ 249,00", estoque: 87 },
  { id: 4, nome: "Monitor 27\" Full HD", ncm: "8528.52.20", cfop: "5102", un: "UN", valor: "R$ 1.299,00", estoque: 32 },
  { id: 5, nome: "Cabo HDMI 2m", ncm: "8544.42.00", cfop: "5102", un: "UN", valor: "R$ 29,90", estoque: 500 },
  { id: 6, nome: "SSD 1TB NVMe", ncm: "8471.70.12", cfop: "5102", un: "UN", valor: "R$ 449,00", estoque: 68 },
];

const ProdutosPage = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialProdutos);
  const [editItem, setEditItem] = useState<typeof initialProdutos[0] | null>(null);
  const [form, setForm] = useState({ nome: "", ncm: "", cfop: "5102", un: "UN", valor: "", estoque: 0 });

  const filtered = items.filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()) || p.ncm.includes(search));
  const resetForm = () => setForm({ nome: "", ncm: "", cfop: "5102", un: "UN", valor: "", estoque: 0 });

  const handleSave = () => {
    if (!form.nome.trim()) { toast.error("Informe a descrição do produto."); return; }
    if (editItem) {
      setItems((prev) => prev.map((p) => p.id === editItem.id ? { ...p, ...form } : p));
      toast.success("Produto atualizado!");
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...form }]);
      toast.success("Produto cadastrado!");
    }
    setOpen(false); setEditItem(null); resetForm();
  };

  const handleEdit = (item: typeof initialProdutos[0]) => {
    setEditItem(item); setForm({ nome: item.nome, ncm: item.ncm, cfop: item.cfop, un: item.un, valor: item.valor, estoque: item.estoque }); setOpen(true);
  };

  const handleDelete = (id: number) => { setItems((prev) => prev.filter((p) => p.id !== id)); toast.success("Produto excluído!"); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Produtos</h1><p className="text-muted-foreground">Cadastro de produtos e serviços</p></div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditItem(null); resetForm(); } }}>
          <DialogTrigger asChild><Button variant="hero"><Plus size={16} className="mr-2" />Novo Produto</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar Produto" : "Cadastrar Produto"}</DialogTitle>
              <DialogDescription>Preencha os dados do produto ou serviço.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2 space-y-2"><Label>Descrição</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div className="space-y-2"><Label>NCM</Label><Input value={form.ncm} onChange={(e) => setForm({ ...form, ncm: e.target.value })} /></div>
              <div className="space-y-2"><Label>CFOP</Label><Input value={form.cfop} onChange={(e) => setForm({ ...form, cfop: e.target.value })} /></div>
              <div className="space-y-2"><Label>Unidade</Label><Input value={form.un} onChange={(e) => setForm({ ...form, un: e.target.value })} placeholder="UN, KG, CX..." /></div>
              <div className="space-y-2"><Label>Valor Unitário</Label><Input value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="R$ 0,00" /></div>
              <div className="space-y-2"><Label>Estoque</Label><Input type="number" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: Number(e.target.value) })} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => { setOpen(false); setEditItem(null); resetForm(); }}>Cancelar</Button>
              <Button variant="hero" onClick={handleSave}>{editItem ? "Atualizar" : "Salvar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar por nome ou NCM..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome", header: "Descrição", render: (r: any) => <div className="flex items-center gap-2"><Package size={16} className="text-primary" /><span className="font-medium">{r.nome}</span></div> },
          { key: "ncm", header: "NCM" }, { key: "cfop", header: "CFOP" }, { key: "un", header: "UN" }, { key: "valor", header: "Valor Unit." }, { key: "estoque", header: "Estoque" },
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

export default ProdutosPage;
