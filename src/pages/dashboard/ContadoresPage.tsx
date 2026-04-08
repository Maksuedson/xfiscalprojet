import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, UserCheck } from "lucide-react";
import { toast } from "sonner";

const contadores = [
  { id: 1, nome: "João Silva Contabilidade", nomeFantasia: "JS Contabil", cnpj: "12.345.678/0001-90", crc: "1SP123456", empresas: 12, status: "Ativo", plano: "Profissional" },
  { id: 2, nome: "Maria Santos Assessoria", nomeFantasia: "MS Assessoria", cnpj: "98.765.432/0001-10", crc: "1RJ654321", empresas: 8, status: "Ativo", plano: "Enterprise" },
  { id: 3, nome: "Carlos Oliveira Contabilidade", nomeFantasia: "CO Contábil", cnpj: "11.222.333/0001-44", crc: "1MG789012", empresas: 5, status: "Ativo", plano: "Starter" },
  { id: 4, nome: "Ana Costa Contábil", nomeFantasia: "AC Contabil", cnpj: "55.666.777/0001-88", crc: "1SP345678", empresas: 15, status: "Ativo", plano: "Enterprise" },
  { id: 5, nome: "Pedro Lima Assessoria", nomeFantasia: "PL Assessoria", cnpj: "33.444.555/0001-22", crc: "1PR901234", empresas: 3, status: "Pendente", plano: "Starter" },
];

const ContadoresPage = () => {
  const [search, setSearch] = useState("");
  const filtered = contadores.filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Contadores</h1><p className="text-muted-foreground">Gerenciar contadores cadastrados</p></div>
        <Button variant="hero" onClick={() => toast.info("Modal de cadastro")}><Plus size={16} className="mr-2" />Novo Contador</Button>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "nome", header: "Nome", render: (r) => <div className="flex items-center gap-2"><UserCheck size={16} className="text-primary" /><span className="font-medium">{r.nomeFantasia}</span></div> },
          { key: "cnpj", header: "CNPJ" },
          { key: "crc", header: "CRC" },
          { key: "empresas", header: "Empresas" },
          { key: "plano", header: "Plano", render: (r) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> },
          { key: "status", header: "Status", render: (r) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Ativo" ? "bg-accent/10 text-accent" : "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]"}`}>{r.status}</span> },
        ]}
        data={filtered}
      />
    </div>
  );
};

export default ContadoresPage;
