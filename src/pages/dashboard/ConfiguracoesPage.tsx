import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, Upload, Shield, Bell, Lock, Save } from "lucide-react";
import { toast } from "sonner";

const ConfiguracoesPage = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState({
    nome: user?.nome || "",
    usuario: user?.usuario || "",
    email: "",
    telefone: "",
  });
  const [senhas, setSenhas] = useState({ atual: "", nova: "", confirmar: "" });
  const [notifs, setNotifs] = useState({ rejeitada: true, pagamento: true, certificado: true });

  const handleSalvarPerfil = () => {
    if (!perfil.nome.trim()) { toast.error("O nome é obrigatório."); return; }
    toast.success("Dados do perfil atualizados com sucesso!");
  };

  const handleAlterarSenha = () => {
    if (!senhas.atual || !senhas.nova) { toast.error("Preencha todos os campos de senha."); return; }
    if (senhas.nova !== senhas.confirmar) { toast.error("As senhas não coincidem."); return; }
    if (senhas.nova.length < 6) { toast.error("A senha deve ter pelo menos 6 caracteres."); return; }
    toast.success("Senha alterada com sucesso!");
    setSenhas({ atual: "", nova: "", confirmar: "" });
  };

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
          <div className="space-y-2"><Label>Nome</Label><Input value={perfil.nome} onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })} /></div>
          <div className="space-y-2"><Label>Usuário</Label><Input value={perfil.usuario} onChange={(e) => setPerfil({ ...perfil, usuario: e.target.value })} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={perfil.email} onChange={(e) => setPerfil({ ...perfil, email: e.target.value })} placeholder="email@exemplo.com" /></div>
          <div className="space-y-2"><Label>Telefone</Label><Input value={perfil.telefone} onChange={(e) => setPerfil({ ...perfil, telefone: e.target.value })} placeholder="(11) 99999-0000" /></div>
        </div>
        <Button variant="hero" onClick={handleSalvarPerfil}><Save size={16} className="mr-2" />Salvar Alterações</Button>
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
          <Button variant="outline" onClick={() => toast.success("Certificado atualizado com sucesso!")}><Upload size={16} className="mr-2" />Atualizar Certificado</Button>
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
            { key: "rejeitada" as const, label: "Nota fiscal rejeitada", desc: "Receba alerta quando uma nota for rejeitada pela SEFAZ" },
            { key: "pagamento" as const, label: "Pagamento confirmado", desc: "Notificação quando um pagamento PIX for confirmado" },
            { key: "certificado" as const, label: "Certificado vencendo", desc: "Alerta 30 dias antes do vencimento do certificado" },
          ].map((n) => (
            <label key={n.key} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer">
              <input type="checkbox" checked={notifs[n.key]} onChange={(e) => setNotifs({ ...notifs, [n.key]: e.target.checked })} className="mt-1 rounded border-border" />
              <div><p className="text-sm font-medium text-foreground">{n.label}</p><p className="text-xs text-muted-foreground">{n.desc}</p></div>
            </label>
          ))}
        </div>
        <Button variant="outline" onClick={() => toast.success("Preferências de notificação salvas!")}><Save size={16} className="mr-2" />Salvar Preferências</Button>
      </div>

      {/* Segurança */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Lock size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Alterar Senha</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2"><Label>Senha Atual</Label><Input type="password" value={senhas.atual} onChange={(e) => setSenhas({ ...senhas, atual: e.target.value })} /></div>
          <div className="space-y-2"><Label>Nova Senha</Label><Input type="password" value={senhas.nova} onChange={(e) => setSenhas({ ...senhas, nova: e.target.value })} /></div>
          <div className="space-y-2"><Label>Confirmar Nova Senha</Label><Input type="password" value={senhas.confirmar} onChange={(e) => setSenhas({ ...senhas, confirmar: e.target.value })} /></div>
        </div>
        <Button variant="outline" onClick={handleAlterarSenha}><Lock size={16} className="mr-2" />Alterar Senha</Button>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
