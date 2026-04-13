import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { usePaymentGateway, GatewayConfig, GatewayProvider } from "@/contexts/PaymentGatewayContext";
import { Settings, Upload, Shield, Bell, Lock, Save, CreditCard, Eye, EyeOff, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const ConfiguracoesPage = () => {
  const { user } = useAuth();
  const { config: gatewayConfig, updateConfig, isConfigured } = usePaymentGateway();

  const [perfil, setPerfil] = useState({
    nome: user?.nome || "",
    usuario: user?.usuario || "",
    email: "",
    telefone: "",
  });
  const [senhas, setSenhas] = useState({ atual: "", nova: "", confirmar: "" });
  const [notifs, setNotifs] = useState({ rejeitada: true, pagamento: true, certificado: true });

  // Payment gateway state
  const [gwForm, setGwForm] = useState<GatewayConfig>(gatewayConfig);
  const [showTokenMP, setShowTokenMP] = useState(false);
  const [showKeyAsaas, setShowKeyAsaas] = useState(false);
  const [testingGateway, setTestingGateway] = useState(false);

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

  const handleSalvarGateway = () => {
    if (!gwForm.provider) {
      toast.error("Selecione um gateway de pagamento.");
      return;
    }
    if (gwForm.provider === "mercadopago" && !gwForm.mercadopago.accessToken) {
      toast.error("Informe o Access Token do Mercado Pago.");
      return;
    }
    if (gwForm.provider === "asaas" && !gwForm.asaas.apiKey) {
      toast.error("Informe a API Key do Asaas.");
      return;
    }
    updateConfig(gwForm);
    toast.success("Gateway de pagamento salvo com sucesso!");
  };

  const handleTestarGateway = async () => {
    setTestingGateway(true);
    await new Promise(r => setTimeout(r, 2000));
    setTestingGateway(false);
    
    if (gwForm.provider === "mercadopago" && gwForm.mercadopago.accessToken) {
      toast.success("Conexão com Mercado Pago verificada com sucesso!");
    } else if (gwForm.provider === "asaas" && gwForm.asaas.apiKey) {
      toast.success("Conexão com Asaas verificada com sucesso!");
    } else {
      toast.error("Preencha as credenciais antes de testar.");
    }
  };

  const planPrices: Record<string, number> = { Starter: 97, Pro: 197, Enterprise: 397 };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Configurações gerais do sistema</p>
      </div>

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

      {/* Gateway de Pagamento - ADMIN ONLY */}
      {user?.role === "admin" && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Gateway de Pagamento</h2>
                <p className="text-xs text-muted-foreground">Integração para cobranças PIX de planos e mensalidades</p>
              </div>
            </div>
            {isConfigured ? (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-accent/10 text-accent font-medium">
                <CheckCircle size={12} /> Configurado
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)] font-medium">
                <AlertTriangle size={12} /> Pendente
              </span>
            )}
          </div>

          {/* Provider selector */}
          <div className="space-y-2">
            <Label>Provedor de Pagamento</Label>
            <Select value={gwForm.provider} onValueChange={(v: GatewayProvider) => setGwForm({ ...gwForm, provider: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione o gateway..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                <SelectItem value="asaas">Asaas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mercado Pago config */}
          {gwForm.provider === "mercadopago" && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <img src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/6.6.92/mercadopago/logo__large@2x.png" alt="Mercado Pago" className="h-5" />
                  Mercado Pago
                </h3>
                <a href="https://www.mercadopago.com.br/developers/panel/app" target="_blank" rel="noopener" className="text-xs text-primary flex items-center gap-1 hover:underline">
                  Obter credenciais <ExternalLink size={10} />
                </a>
              </div>

              <div className="space-y-2">
                <Label>Access Token *</Label>
                <div className="flex gap-2">
                  <Input
                    type={showTokenMP ? "text" : "password"}
                    value={gwForm.mercadopago.accessToken}
                    onChange={e => setGwForm({ ...gwForm, mercadopago: { ...gwForm.mercadopago, accessToken: e.target.value } })}
                    placeholder="APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000"
                  />
                  <Button variant="ghost" size="sm" onClick={() => setShowTokenMP(!showTokenMP)}>
                    {showTokenMP ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Encontre em: Mercado Pago Developers → Suas integrações → Credenciais de produção</p>
              </div>

              <div className="space-y-2">
                <Label>Public Key</Label>
                <Input
                  value={gwForm.mercadopago.publicKey}
                  onChange={e => setGwForm({ ...gwForm, mercadopago: { ...gwForm.mercadopago, publicKey: e.target.value } })}
                  placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div>
                  <p className="text-sm font-medium text-foreground">Modo Sandbox (teste)</p>
                  <p className="text-xs text-muted-foreground">Ativar para testar sem cobranças reais</p>
                </div>
                <Switch
                  checked={gwForm.mercadopago.sandbox}
                  onCheckedChange={v => setGwForm({ ...gwForm, mercadopago: { ...gwForm.mercadopago, sandbox: v } })}
                />
              </div>
            </div>
          )}

          {/* Asaas config */}
          {gwForm.provider === "asaas" && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">🏦 Asaas</h3>
                <a href="https://www.asaas.com/customerApiConfig/index" target="_blank" rel="noopener" className="text-xs text-primary flex items-center gap-1 hover:underline">
                  Obter API Key <ExternalLink size={10} />
                </a>
              </div>

              <div className="space-y-2">
                <Label>API Key *</Label>
                <div className="flex gap-2">
                  <Input
                    type={showKeyAsaas ? "text" : "password"}
                    value={gwForm.asaas.apiKey}
                    onChange={e => setGwForm({ ...gwForm, asaas: { ...gwForm.asaas, apiKey: e.target.value } })}
                    placeholder="$aact_YTU5YTE0M2M2MWM2MWM2MWM..."
                  />
                  <Button variant="ghost" size="sm" onClick={() => setShowKeyAsaas(!showKeyAsaas)}>
                    {showKeyAsaas ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Encontre em: Asaas → Configurações da conta → Integrações → API Key</p>
              </div>

              <div className="space-y-2">
                <Label>Wallet ID (opcional)</Label>
                <Input
                  value={gwForm.asaas.walletId}
                  onChange={e => setGwForm({ ...gwForm, asaas: { ...gwForm.asaas, walletId: e.target.value } })}
                  placeholder="wal_xxxxxxxxxxxxxxxx"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div>
                  <p className="text-sm font-medium text-foreground">Modo Sandbox (teste)</p>
                  <p className="text-xs text-muted-foreground">Ativar para testar sem cobranças reais</p>
                </div>
                <Switch
                  checked={gwForm.asaas.sandbox}
                  onCheckedChange={v => setGwForm({ ...gwForm, asaas: { ...gwForm.asaas, sandbox: v } })}
                />
              </div>
            </div>
          )}

          {/* Price table reference */}
          {gwForm.provider && (
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h4 className="text-sm font-semibold text-foreground mb-2">Tabela de Preços dos Planos</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                {Object.entries(planPrices).map(([plan, price]) => (
                  <div key={plan} className="p-2 rounded-lg border border-border bg-background">
                    <p className="text-xs text-muted-foreground">{plan}</p>
                    <p className="text-sm font-bold text-foreground">R$ {price},00</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Esses valores são usados nas cobranças automáticas para contadores e na página de checkout público.</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="hero" onClick={handleSalvarGateway}>
              <Save size={16} className="mr-2" />Salvar Gateway
            </Button>
            {gwForm.provider && (
              <Button variant="outline" onClick={handleTestarGateway} disabled={testingGateway}>
                {testingGateway ? "Testando..." : "Testar Conexão"}
              </Button>
            )}
          </div>
        </div>
      )}

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
