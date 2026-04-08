import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Truck } from "lucide-react";
import { toast } from "sonner";

const fornecedores = [
  { id: 1, nome: "Distribuidora Nacional SA", cnpj: "11.222.333/0001-44", email: "contato@distnac.com", telefone: "(11) 3333-4444", cidade: "São Paulo", uf: "SP" },
  { id: 2, nome: "Importadora Global LTDA", cnpj: "55.666.777/0001-88", email: "compras@global.com", telefone: "(21) 2222-3333", cidade: "Rio de Janeiro", uf: "RJ" },
  { id: 3, nome: "Atacado Central ME", cnpj: "33.444.555/0001-22", email: "vendas@atacado.com", telefone: "(31) 4444-5555", cidade: "Belo Horizonte", uf: "MG" },
  { id: 4, nome: "Tech Parts Componentes", cnpj: "77.888.999/0001-55", email: "parts@tech.com", telefone: "(41) 5555-6666", cidade: "Curitiba", uf: "PR" },
];

const FornecedoresPage = () => {
  const [search, setSearch] = useState("");
  const filtered = fornecedores.filter((f) => f.nome.toLowerCase().includes(search.toLowerCase()) || f.cnpj.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Fornecedores</h1><p className="text-muted-foreground">Cadastro de fornecedores</p></div>
        <Button variant="hero" onClick={() => toast.info("Modal de cadastro")}><Plus size={16} className="mr-2" />Novo Fornecedor</Button>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome", header: "Razão Social", render: (r) => <div className="flex items-center gap-2"><Truck size={16} className="text-primary" /><span className="font-medium">{r.nome}</span></div> },
          { key: "cnpj", header: "CNPJ" }, { key: "email", header: "Email" }, { key: "telefone", header: "Telefone" }, { key: "cidade", header: "Cidade" }, { key: "uf", header: "UF" },
        ]}
        data={filtered}
      />
    </div>
  );
};

export default FornecedoresPage;
