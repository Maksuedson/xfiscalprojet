import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialEmpresas = [
  { id: 1, xFant: "Tech Solutions LTDA", cnpj: "12.345.678/0001-90", ie: "123456789", uf: "SP", cidade: "São Paulo", status: "Ativo", notas: 142 },
  { id: 2, xFant: "Comércio Digital ME", cnpj: "98.765.432/0001-10", ie: "987654321", uf: "RJ", cidade: "Rio de Janeiro", status: "Ativo", notas: 89 },
  { id: 3, xFant: "Import Export SA", cnpj: "11.222.333/0001-44", ie: "112233445", uf: "MG", cidade: "Belo Horizonte", status: "Ativo", notas: 256 },
  { id: 4, xFant: "Restaurante Sabor", cnpj: "55.666.777/0001-88", ie: "556677889", uf: "SP", cidade: "Campinas", status: "Ativo", notas: 567 },
  { id: 5, xFant: "Loja Virtual Pro", cnpj: "33.444.555/0001-22", ie: "334455667", uf: "PR", cidade: "Curitiba", status: "Desativado", notas: 34 },
  { id: 6, xFant: "Padaria Central", cnpj: "77.888.999/0001-55", ie: "778899001", uf: "SP", cidade: "Santos", status: "Ativo", notas: 423 },
];

const EmpresasPage = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = initialEmpresas.filter((e) =>
    e.xFant.toLowerCase().includes(search.toLowerCase()) || e.cnpj.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Empresas</h1>
          <p className="text-muted-foreground">Gerencie as empresas cadastradas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus size={16} className="mr-2" />Nova Empresa</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Cadastrar Empresa</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2 space-y-2"><Label>Nome Fantasia</Label><Input placeholder="Ex: Minha Empresa LTDA" /></div>
              <div className="space-y-2"><Label>CNPJ</Label><Input placeholder="00.000.000/0001-00" /></div>
              <div className="space-y-2"><Label>Inscrição Estadual</Label><Input placeholder="000000000" /></div>
              <div className="space-y-2"><Label>UF</Label><Input placeholder="SP" /></div>
              <div className="space-y-2"><Label>Cidade</Label><Input placeholder="São Paulo" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button variant="hero" onClick={() => { toast.success("Empresa cadastrada!"); setOpen(false); }}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <DataTable
        columns={[
          { key: "xFant", header: "Nome Fantasia", render: (r) => <div className="flex items-center gap-2"><Building2 size={16} className="text-primary" /><span className="font-medium">{r.xFant}</span></div> },
          { key: "cnpj", header: "CNPJ" },
          { key: "ie", header: "IE" },
          { key: "uf", header: "UF" },
          { key: "cidade", header: "Cidade" },
          { key: "notas", header: "Notas" },
          { key: "status", header: "Status", render: (r) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Ativo" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
        ]}
        data={filtered}
      />
    </div>
  );
};

export default EmpresasPage;
