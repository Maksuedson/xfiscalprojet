import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, Upload, Shield, Bell } from "lucide-react";
import { toast } from "sonner";

const ConfiguracoesPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold text-foreground">Configurações</h1><p className="text-muted-foreground">Configurações gerais do sistema</p></div>

      {/* Dados da conta */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Settings size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Dados da Conta</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Nome</Label><Input defaultValue={user?.nome} /></div>
          <div className="space-y-2"><Label>Usuário</Label><Input defaultValue={user?.usuario} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@exemplo.com" /></div>
          <div className="space-y-2"><Label>Telefone</Label><Input placeholder="(11) 99999-0000" /></div>
        </div>
        <Button variant="hero" onClick={() => toast.success("Dados atualizados!")}>Salvar Alterações</Button>
      </div>

      {/* Certificado Digital */}
      {(user?.role === "contador" || user?.role === "emissor") && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Certificado Digital A1</h2>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
            <Upload size={24} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Certificado_A1_2026.pfx</p>
              <p className="text-xs text-muted-foreground">Válido até 15/12/2026</p>
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-accent/10 text-accent font-medium">Válido</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Arquivo do Certificado (.pfx)</Label><Input type="file" accept=".pfx,.p12" /></div>
            <div className="space-y-2"><Label>Senha do Certificado</Label><Input type="password" placeholder="••••••••" /></div>
          </div>
          <Button variant="outline" onClick={() => toast.success("Certificado atualizado!")}>Atualizar Certificado</Button>
        </div>
      )}

      {/* Notificações */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Nota fiscal rejeitada", desc: "Receba alerta quando uma nota for rejeitada pela SEFAZ" },
            { label: "Pagamento confirmado", desc: "Notificação quando um pagamento PIX for confirmado" },
            { label: "Certificado vencendo", desc: "Alerta 30 dias antes do vencimento do certificado" },
          ].map((n) => (
            <label key={n.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 rounded border-border" />
              <div><p className="text-sm font-medium text-foreground">{n.label}</p><p className="text-xs text-muted-foreground">{n.desc}</p></div>
            </label>
          ))}
        </div>
        <Button variant="outline" onClick={() => toast.success("Preferências salvas!")}>Salvar Preferências</Button>
      </div>

      {/* Segurança */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Alterar Senha</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Senha Atual</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>Nova Senha</Label><Input type="password" /></div>
        </div>
        <Button variant="outline" onClick={() => toast.success("Senha alterada!")}>Alterar Senha</Button>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
