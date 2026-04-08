import { useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Download, Eye } from "lucide-react";
import { useParams } from "react-router-dom";

const notasData: Record<string, any[]> = {
  entrada: [
    { numero: "000045", serie: "1", chave: "3526...0045", emitente: "Fornecedor XYZ SA", valor: "R$ 12.800,00", status: "Autorizada", data: "05/04/2026" },
    { numero: "000044", serie: "1", chave: "3526...0044", emitente: "Distribuidora Nacional", valor: "R$ 8.450,00", status: "Autorizada", data: "03/04/2026" },
    { numero: "000043", serie: "1", chave: "3526...0043", emitente: "Tech Parts LTDA", valor: "R$ 3.200,00", status: "Autorizada", data: "01/04/2026" },
    { numero: "000042", serie: "1", chave: "3526...0042", emitente: "Atacado Central", valor: "R$ 15.600,00", status: "Autorizada", data: "28/03/2026" },
  ],
  saida: [
    { numero: "000142", serie: "1", chave: "3526...0142", destinatario: "Cliente ABC LTDA", valor: "R$ 4.250,00", status: "Autorizada", data: "05/04/2026" },
    { numero: "000141", serie: "1", chave: "3526...0141", destinatario: "Maria da Silva", valor: "R$ 1.890,00", status: "Autorizada", data: "04/04/2026" },
    { numero: "000140", serie: "1", chave: "3526...0140", destinatario: "Supermercado Central", valor: "R$ 6.320,00", status: "Autorizada", data: "03/04/2026" },
    { numero: "000139", serie: "1", chave: "3526...0139", destinatario: "João Pereira ME", valor: "R$ 950,00", status: "Rejeitada", data: "02/04/2026" },
  ],
  devolucao: [
    { numero: "000008", serie: "1", chave: "3526...0008", destinatario: "Cliente DEF ME", valor: "R$ 1.350,00", status: "Autorizada", data: "03/04/2026" },
    { numero: "000007", serie: "1", chave: "3526...0007", destinatario: "Comércio XY", valor: "R$ 780,00", status: "Autorizada", data: "15/03/2026" },
  ],
};

const tipoLabels: Record<string, string> = {
  entrada: "NF-e de Entrada",
  saida: "NF-e de Saída",
  devolucao: "NF-e de Devolução",
};

const NFePage = () => {
  const { tipo = "saida" } = useParams<{ tipo: string }>();
  const [search, setSearch] = useState("");
  const notas = notasData[tipo] || [];
  const parteKey = tipo === "entrada" ? "emitente" : "destinatario";
  const filtered = notas.filter((n) => (n[parteKey] || "").toLowerCase().includes(search.toLowerCase()) || n.numero.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">{tipoLabels[tipo] || "Notas Fiscais"}</h1><p className="text-muted-foreground">Gerenciar notas fiscais eletrônicas</p></div>
        <Button variant="hero"><Plus size={16} className="mr-2" />Emitir {tipoLabels[tipo]?.split(" ").pop()}</Button>
      </div>
      <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar por número ou nome..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <DataTable
        columns={[
          { key: "numero", header: "Número", render: (r) => <div className="flex items-center gap-2"><FileText size={16} className="text-primary" /><span className="font-medium">{r.numero}</span></div> },
          { key: "serie", header: "Série" },
          { key: parteKey, header: tipo === "entrada" ? "Emitente" : "Destinatário" },
          { key: "valor", header: "Valor" },
          { key: "status", header: "Status", render: (r) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Autorizada" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
          { key: "data", header: "Data" },
          { key: "acoes", header: "Ações", render: () => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Eye size={14} /></Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Download size={14} /></Button>
            </div>
          )},
        ]}
        data={filtered}
      />
    </div>
  );
};

export default NFePage;
