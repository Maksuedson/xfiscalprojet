import { useState } from "react";
import { Shield, Filter, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/dashboard/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const auditLogs = [
  { id: "1", dataHora: "11/04/2026 14:32", usuario: "admin", perfil: "Admin", acao: "Login", modulo: "Autenticação", detalhes: "Login realizado com sucesso", ip: "187.45.123.88" },
  { id: "2", dataHora: "11/04/2026 14:28", usuario: "João Silva", perfil: "Contador", acao: "Cadastro", modulo: "Empresas", detalhes: "Cadastrou empresa Loja Virtual Pro", ip: "201.12.45.67" },
  { id: "3", dataHora: "11/04/2026 13:55", usuario: "Tech Solutions", perfil: "Emissor", acao: "Emissão", modulo: "NF-e", detalhes: "NF-e 000142 autorizada - R$ 4.250,00", ip: "189.33.78.12" },
  { id: "4", dataHora: "11/04/2026 13:40", usuario: "admin", perfil: "Admin", acao: "Cobrança", modulo: "Cobranças", detalhes: "Gerou cobrança para Carlos Oliveira - R$ 97,00", ip: "187.45.123.88" },
  { id: "5", dataHora: "11/04/2026 12:15", usuario: "João Silva", perfil: "Contador", acao: "Certificado", modulo: "Certificados", detalhes: "Upload certificado A1 - Comércio Digital ME", ip: "201.12.45.67" },
  { id: "6", dataHora: "11/04/2026 11:30", usuario: "admin", perfil: "Admin", acao: "Cadastro", modulo: "Contadores", detalhes: "Cadastrou contador Pedro Lima Assessoria", ip: "187.45.123.88" },
  { id: "7", dataHora: "11/04/2026 10:45", usuario: "Maria Santos", perfil: "Contador", acao: "Pagamento", modulo: "Cobranças", detalhes: "Confirmou pagamento PIX - Import Export SA", ip: "177.88.22.33" },
  { id: "8", dataHora: "11/04/2026 10:20", usuario: "Tech Solutions", perfil: "Emissor", acao: "Emissão", modulo: "NFC-e", detalhes: "NFC-e emitida - Consumidor Final - R$ 89,90", ip: "189.33.78.12" },
  { id: "9", dataHora: "10/04/2026 18:00", usuario: "admin", perfil: "Admin", acao: "Configuração", modulo: "Sistema", detalhes: "Atualizou configurações de notificação", ip: "187.45.123.88" },
  { id: "10", dataHora: "10/04/2026 16:30", usuario: "João Silva", perfil: "Contador", acao: "Exclusão", modulo: "Clientes", detalhes: "Removeu cliente inativo - Empresa XYZ", ip: "201.12.45.67" },
];

const AuditoriaPage = () => {
  const [busca, setBusca] = useState("");
  const [filtroModulo, setFiltroModulo] = useState("todos");
  const [filtroPerfil, setFiltroPerfil] = useState("todos");

  const filtered = auditLogs.filter(log => {
    const matchBusca = !busca || log.usuario.toLowerCase().includes(busca.toLowerCase()) || log.detalhes.toLowerCase().includes(busca.toLowerCase());
    const matchModulo = filtroModulo === "todos" || log.modulo === filtroModulo;
    const matchPerfil = filtroPerfil === "todos" || log.perfil === filtroPerfil;
    return matchBusca && matchModulo && matchPerfil;
  });

  const handleExportar = () => {
    const csv = ["Data/Hora,Usuário,Perfil,Ação,Módulo,Detalhes,IP", ...filtered.map(l => `${l.dataHora},${l.usuario},${l.perfil},${l.acao},${l.modulo},${l.detalhes},${l.ip}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "auditoria_xfiscal.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exportação concluída", description: `${filtered.length} registros exportados` });
  };

  const modulos = [...new Set(auditLogs.map(l => l.modulo))];
  const acaoColors: Record<string, string> = {
    Login: "bg-primary/10 text-primary",
    Cadastro: "bg-accent/10 text-accent",
    Emissão: "bg-primary/10 text-primary",
    Cobrança: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
    Certificado: "bg-accent/10 text-accent",
    Pagamento: "bg-accent/10 text-accent",
    Exclusão: "bg-destructive/10 text-destructive",
    Configuração: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Auditoria do Sistema</h1>
          <p className="text-muted-foreground">Log de todas as ações realizadas na plataforma</p>
        </div>
        <Button variant="outline" onClick={handleExportar}><Download size={16} className="mr-2" /> Exportar CSV</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por usuário ou detalhe..." className="pl-9" />
        </div>
        <Select value={filtroModulo} onValueChange={setFiltroModulo}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Módulo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os módulos</SelectItem>
            {modulos.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filtroPerfil} onValueChange={setFiltroPerfil}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Perfil" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os perfis</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Contador">Contador</SelectItem>
            <SelectItem value="Emissor">Emissor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} registros encontrados</p>

      <DataTable
        columns={[
          { key: "dataHora", header: "Data/Hora" },
          { key: "usuario", header: "Usuário" },
          { key: "perfil", header: "Perfil", render: (r: any) => {
            const c: Record<string, string> = { Admin: "bg-destructive/10 text-destructive", Contador: "bg-primary/10 text-primary", Emissor: "bg-accent/10 text-accent" };
            return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c[r.perfil]}`}>{r.perfil}</span>;
          }},
          { key: "acao", header: "Ação", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${acaoColors[r.acao] || "bg-muted text-muted-foreground"}`}>{r.acao}</span> },
          { key: "modulo", header: "Módulo" },
          { key: "detalhes", header: "Detalhes" },
          { key: "ip", header: "IP" },
        ]}
        data={filtered}
      />
    </div>
  );
};

export default AuditoriaPage;
