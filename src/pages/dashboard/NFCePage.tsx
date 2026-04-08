import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Receipt, Download, Eye } from "lucide-react";

const nfces = [
  { numero: "000892", serie: "1", consumidor: "Consumidor Final", valor: "R$ 89,90", status: "Autorizada", data: "05/04/2026 14:32" },
  { numero: "000891", serie: "1", consumidor: "Consumidor Final", valor: "R$ 156,50", status: "Autorizada", data: "05/04/2026 11:15" },
  { numero: "000890", serie: "1", consumidor: "João Silva", valor: "R$ 342,00", status: "Autorizada", data: "04/04/2026 16:45" },
  { numero: "000889", serie: "1", consumidor: "Consumidor Final", valor: "R$ 67,80", status: "Rejeitada", data: "04/04/2026 10:22" },
  { numero: "000888", serie: "1", consumidor: "Maria Santos", valor: "R$ 1.250,00", status: "Autorizada", data: "03/04/2026 15:30" },
];

const NFCePage = () => {
  const [search, setSearch] = useState("");
  const filtered = nfces.filter((n) => n.consumidor.toLowerCase().includes(search.toLowerCase()) || n.numero.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">NFC-e</h1><p className="text-muted-foreground">Nota Fiscal de Consumidor Eletrônica</p></div>
        <Button variant="hero"><Plus size={16} className="mr-2" />Emitir NFC-e</Button>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "numero", header: "Número", render: (r) => <div className="flex items-center gap-2"><Receipt size={16} className="text-primary" /><span className="font-medium">{r.numero}</span></div> },
          { key: "serie", header: "Série" }, { key: "consumidor", header: "Consumidor" }, { key: "valor", header: "Valor" },
          { key: "status", header: "Status", render: (r) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Autorizada" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
          { key: "data", header: "Data/Hora" },
          { key: "acoes", header: "Ações", render: () => <div className="flex gap-1"><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Eye size={14} /></Button><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Download size={14} /></Button></div> },
        ]}
        data={filtered}
      />
    </div>
  );
};

export default NFCePage;
