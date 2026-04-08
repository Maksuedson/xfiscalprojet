import DataTable from "@/components/dashboard/DataTable";
import { useAuth } from "@/contexts/AuthContext";
import { Receipt } from "lucide-react";

const mensalidadesAdmin = [
  { contador: "João Silva Contabilidade", competencia: "Abr/2026", valor: "R$ 197,00", vencimento: "10/04/2026", status: "pago", pago_em: "08/04/2026" },
  { contador: "Maria Santos Assessoria", competencia: "Abr/2026", valor: "R$ 397,00", vencimento: "10/04/2026", status: "pendente", pago_em: "-" },
  { contador: "Carlos Oliveira Cont.", competencia: "Abr/2026", valor: "R$ 97,00", vencimento: "10/04/2026", status: "pago", pago_em: "05/04/2026" },
  { contador: "Ana Costa Contábil", competencia: "Mar/2026", valor: "R$ 397,00", vencimento: "10/03/2026", status: "pago", pago_em: "09/03/2026" },
  { contador: "Pedro Lima Assessoria", competencia: "Mar/2026", valor: "R$ 97,00", vencimento: "10/03/2026", status: "atrasado", pago_em: "-" },
];

const mensalidadesContador = [
  { competencia: "Abr/2026", valor: "R$ 197,00", vencimento: "10/04/2026", status: "pago", pago_em: "08/04/2026" },
  { competencia: "Mar/2026", valor: "R$ 197,00", vencimento: "10/03/2026", status: "pago", pago_em: "09/03/2026" },
  { competencia: "Fev/2026", valor: "R$ 197,00", vencimento: "10/02/2026", status: "pago", pago_em: "08/02/2026" },
  { competencia: "Jan/2026", valor: "R$ 197,00", vencimento: "10/01/2026", status: "pago", pago_em: "07/01/2026" },
];

const statusStyle: Record<string, string> = {
  pago: "bg-accent/10 text-accent",
  pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
  atrasado: "bg-destructive/10 text-destructive",
};

const MensalidadesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Mensalidades</h1><p className="text-muted-foreground">{isAdmin ? "Controle de mensalidades dos contadores" : "Histórico de mensalidades"}</p></div>

      <DataTable
        columns={[
          ...(isAdmin ? [{ key: "contador", header: "Contador", render: (r: any) => <div className="flex items-center gap-2"><Receipt size={16} className="text-primary" /><span className="font-medium">{r.contador}</span></div> }] : []),
          { key: "competencia", header: "Competência" },
          { key: "valor", header: "Valor" },
          { key: "vencimento", header: "Vencimento" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[r.status] || statusStyle.pendente}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span> },
          { key: "pago_em", header: "Pago em" },
        ]}
        data={isAdmin ? mensalidadesAdmin : mensalidadesContador}
      />
    </div>
  );
};

export default MensalidadesPage;
