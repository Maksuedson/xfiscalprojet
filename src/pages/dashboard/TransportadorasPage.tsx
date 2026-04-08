import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Truck } from "lucide-react";
import { toast } from "sonner";

const transportadoras = [
  { id: 1, nome: "Transportes Rápido LTDA", cnpj: "12.345.678/0001-90", rntrc: "12345678", telefone: "(11) 3333-4444", uf: "SP" },
  { id: 2, nome: "Logística Express SA", cnpj: "98.765.432/0001-10", rntrc: "87654321", telefone: "(21) 2222-3333", uf: "RJ" },
  { id: 3, nome: "Frete Seguro ME", cnpj: "55.666.777/0001-88", rntrc: "55667788", telefone: "(31) 4444-5555", uf: "MG" },
];

const TransportadorasPage = () => {
  const [search, setSearch] = useState("");
  const filtered = transportadoras.filter((t) => t.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Transportadoras</h1><p className="text-muted-foreground">Cadastro de transportadoras</p></div>
        <Button variant="hero" onClick={() => toast.info("Modal de cadastro")}><Plus size={16} className="mr-2" />Nova Transportadora</Button>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome", header: "Razão Social", render: (r) => <div className="flex items-center gap-2"><Truck size={16} className="text-primary" /><span className="font-medium">{r.nome}</span></div> },
          { key: "cnpj", header: "CNPJ" }, { key: "rntrc", header: "RNTRC" }, { key: "telefone", header: "Telefone" }, { key: "uf", header: "UF" },
        ]}
        data={filtered}
      />
    </div>
  );
};

export default TransportadorasPage;
