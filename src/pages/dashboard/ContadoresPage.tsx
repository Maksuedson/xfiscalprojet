import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, UserCheck, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialContadores = [
  { id: 1, nome: "João Silva Contabilidade", nomeFantasia: "JS Contabil", cnpj: "12.345.678/0001-90", crc: "1SP123456", empresas: 12, status: "Ativo", plano: "Profissional", valorMensalidade: "R$ 197,00" },
  { id: 2, nome: "Maria Santos Assessoria", nomeFantasia: "MS Assessoria", cnpj: "98.765.432/0001-10", crc: "1RJ654321", empresas: 8, status: "Ativo", plano: "Enterprise", valorMensalidade: "R$ 397,00" },
  { id: 3, nome: "Carlos Oliveira Contabilidade", nomeFantasia: "CO Contábil", cnpj: "11.222.333/0001-44", crc: "1MG789012", empresas: 5, status: "Ativo", plano: "Starter", valorMensalidade: "R$ 97,00" },
  { id: 4, nome: "Ana Costa Contábil", nomeFantasia: "AC Contabil", cnpj: "55.666.777/0001-88", crc: "1SP345678", empresas: 15, status: "Ativo", plano: "Enterprise", valorMensalidade: "R$ 397,00" },
  { id: 5, nome: "Pedro Lima Assessoria", nomeFantasia: "PL Assessoria", cnpj: "33.444.555/0001-22", crc: "1PR901234", empresas: 3, status: "Pendente", plano: "Starter", valorMensalidade: "R$ 97,00" },
];

const ContadoresPage = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialContadores);
  const [editItem, setEditItem] = useState<typeof initialContadores[0] | null>(null);
  const [form, setForm] = useState({ nome: "", nomeFantasia: "", cnpj: "", crc: "", plano: "Starter" });

  const filtered = items.filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cnpj.includes(search));

  const resetForm = () => setForm({ nome: "", nomeFantasia: "", cnpj: "", crc: "", plano: "Starter" });

  const planoValor: Record<string, string> = { Starter: "R$ 97,00", Profissional: "R$ 197,00", Enterprise: "R$ 397,00" };

  const handleSave = () => {
    if (!form.nome.trim() || !form.cnpj.trim()) { toast.error("Preencha pelo menos nome e CNPJ."); return; }
    if (editItem) {
      setItems((prev) => prev.map((c) => c.id === editItem.id ? { ...c, ...form, valorMensalidade: planoValor[form.plano] || "R$ 97,00" } : c));
      toast.success("Contador atualizado!");
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...form, empresas: 0, status: "Pendente", valorMensalidade: planoValor[form.plano] || "R$ 97,00" }]);
      toast.success("Contador cadastrado!");
    }
    setOpen(false); setEditItem(null); resetForm();
  };

  const handleEdit = (item: typeof initialContadores[0]) => {
    setEditItem(item);
    setForm({ nome: item.nome, nomeFantasia: item.nomeFantasia, cnpj: item.cnpj, crc: item.crc, plano: item.plano });
    setOpen(true);
  };

  const handleDelete = (id: number) => { setItems((prev) => prev.filter((c) => c.id !== id)); toast.success("Contador excluído!"); };

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
              <div className="sm:col-span-2 space-y-2"><Label>Razão Social</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Silva Contabilidade" /></div>
              <div className="space-y-2"><Label>Nome Fantasia</Label><Input value={form.nomeFantasia} onChange={(e) => setForm({ ...form, nomeFantasia: e.target.value })} /></div>
              <div className="space-y-2"><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0001-00" /></div>
              <div className="space-y-2"><Label>CRC</Label><Input value={form.crc} onChange={(e) => setForm({ ...form, crc: e.target.value })} placeholder="1SP000000" /></div>
              <div className="space-y-2">
                <Label>Plano</Label>
                <select value={form.plano} onChange={(e) => setForm({ ...form, plano: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="Starter">Starter — R$ 97/mês</option>
                  <option value="Profissional">Profissional — R$ 197/mês</option>
                  <option value="Enterprise">Enterprise — R$ 397/mês</option>
                </select>
              </div>
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
          { key: "nome", header: "Nome", render: (r: any) => <div className="flex items-center gap-2"><UserCheck size={16} className="text-primary" /><span className="font-medium">{r.nomeFantasia}</span></div> },
          { key: "cnpj", header: "CNPJ" },
          { key: "crc", header: "CRC" },
          { key: "empresas", header: "Empresas" },
          { key: "plano", header: "Plano", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> },
          { key: "valorMensalidade", header: "Mensalidade" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Ativo" ? "bg-accent/10 text-accent" : "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]"}`}>{r.status}</span> },
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
