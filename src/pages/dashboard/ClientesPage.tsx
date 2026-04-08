import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const clientes = [
  { id: 1, nome: "Cliente ABC LTDA", cpfCnpj: "12.345.678/0001-90", email: "contato@abc.com", telefone: "(11) 99999-0001", cidade: "São Paulo", uf: "SP" },
  { id: 2, nome: "Maria da Silva", cpfCnpj: "123.456.789-00", email: "maria@email.com", telefone: "(21) 98888-0002", cidade: "Rio de Janeiro", uf: "RJ" },
  { id: 3, nome: "Distribuidora Norte", cpfCnpj: "98.765.432/0001-10", email: "norte@dist.com", telefone: "(31) 97777-0003", cidade: "Belo Horizonte", uf: "MG" },
  { id: 4, nome: "João Pereira ME", cpfCnpj: "456.789.012-34", email: "joao@pereira.com", telefone: "(41) 96666-0004", cidade: "Curitiba", uf: "PR" },
  { id: 5, nome: "Supermercado Central", cpfCnpj: "55.666.777/0001-88", email: "central@super.com", telefone: "(11) 95555-0005", cidade: "Campinas", uf: "SP" },
];

const ClientesPage = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = clientes.filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpfCnpj.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Cadastro de clientes para emissão de notas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="hero"><Plus size={16} className="mr-2" />Novo Cliente</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Cadastrar Cliente</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2 space-y-2"><Label>Nome / Razão Social</Label><Input /></div>
              <div className="space-y-2"><Label>CPF / CNPJ</Label><Input /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" /></div>
              <div className="space-y-2"><Label>Telefone</Label><Input /></div>
              <div className="space-y-2"><Label>Cidade</Label><Input /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button variant="hero" onClick={() => { toast.success("Cliente cadastrado!"); setOpen(false); }}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar por nome ou CPF/CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome", header: "Nome", render: (r) => <div className="flex items-center gap-2"><Users size={16} className="text-primary" /><span className="font-medium">{r.nome}</span></div> },
          { key: "cpfCnpj", header: "CPF/CNPJ" },
          { key: "email", header: "Email" },
          { key: "telefone", header: "Telefone" },
          { key: "cidade", header: "Cidade" },
          { key: "uf", header: "UF" },
        ]}
        data={filtered}
      />
    </div>
  );
};

export default ClientesPage;
