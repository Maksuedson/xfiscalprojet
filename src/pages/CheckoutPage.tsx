import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentGateway } from "@/contexts/PaymentGatewayContext";
import { Check, Copy, ArrowLeft, Loader2, AlertTriangle, QrCode } from "lucide-react";
import { toast } from "sonner";

const PLANS: Record<string, { name: string; price: number; features: string[] }> = {
  starter: {
    name: "Starter",
    price: 97,
    features: ["Até 5 empresas", "NF-e e NFC-e ilimitadas", "Cobrança PIX básica", "Relatórios essenciais", "Suporte por email"],
  },
  profissional: {
    name: "Profissional",
    price: 197,
    features: ["Até 30 empresas", "NF-e e NFC-e ilimitadas", "Cobrança PIX automática", "Relatórios avançados com gráficos", "Alertas por email e WhatsApp", "Suporte prioritário"],
  },
  enterprise: {
    name: "Enterprise",
    price: 397,
    features: ["Empresas ilimitadas", "NF-e e NFC-e ilimitadas", "Cobrança PIX + boleto", "Relatórios com exportação PDF/Excel", "API de integração", "White-label", "Suporte dedicado"],
  },
};

const CheckoutPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isConfigured, config, generatePixPayment } = usePaymentGateway();
  const planKey = params.get("plano") || "starter";
  const plan = PLANS[planKey] || PLANS.starter;

  const [form, setForm] = useState({ nome: "", email: "", cpfCnpj: "", telefone: "" });
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qrCode?: string; pixCopiaECola?: string; idCobranca?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePagar = async () => {
    if (!form.nome || !form.email || !form.cpfCnpj) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    const result = await generatePixPayment({
      valor: plan.price,
      descricao: `Assinatura xFiscal - Plano ${plan.name}`,
      pagadorNome: form.nome,
      pagadorCpfCnpj: form.cpfCnpj,
    });
    setLoading(false);

    if (result.success) {
      setPixData({ qrCode: result.qrCode, pixCopiaECola: result.pixCopiaECola, idCobranca: result.idCobranca });
      toast.success("PIX gerado com sucesso!");
    } else {
      toast.error(result.error || "Erro ao gerar pagamento.");
    }
  };

  const handleCopy = () => {
    if (pixData?.pixCopiaECola) {
      navigator.clipboard.writeText(pixData.pixCopiaECola);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft size={16} className="mr-2" /> Voltar
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan summary */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit">
            <h2 className="text-xl font-bold text-foreground mb-1">Plano {plan.name}</h2>
            <p className="text-3xl font-bold text-primary mb-4">R${plan.price}<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
            <ul className="space-y-2 mb-4">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                  <Check size={14} className="text-accent shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className="p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
              <p>Pagamento via <strong>{config.provider === "asaas" ? "Asaas" : "Mercado Pago"}</strong> (PIX)</p>
              <p className="mt-1">{config.provider === "mercadopago" && config.mercadopago.sandbox ? "⚠️ Modo Sandbox (teste)" : config.provider === "asaas" && config.asaas.sandbox ? "⚠️ Modo Sandbox (teste)" : "✅ Modo Produção"}</p>
            </div>
          </div>

          {/* Payment form or QR Code */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            {!isConfigured ? (
              <div className="text-center py-8 space-y-4">
                <AlertTriangle size={48} className="mx-auto text-[hsl(45,93%,47%)]" />
                <h3 className="text-lg font-semibold text-foreground">Gateway não configurado</h3>
                <p className="text-sm text-muted-foreground">O administrador precisa configurar o Mercado Pago ou Asaas nas configurações do painel.</p>
                <Button variant="outline" onClick={() => navigate("/login")}>Ir para o Painel</Button>
              </div>
            ) : !pixData ? (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-4">Dados para pagamento</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome completo / Razão Social *</Label>
                    <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="João Silva Contabilidade" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contato@empresa.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF/CNPJ *</Label>
                    <Input value={form.cpfCnpj} onChange={e => setForm({ ...form, cpfCnpj: e.target.value })} placeholder="00.000.000/0001-00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="(11) 99999-0000" />
                  </div>
                  <Button className="w-full" size="lg" onClick={handlePagar} disabled={loading}>
                    {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Gerando PIX...</> : <><QrCode size={16} className="mr-2" /> Pagar R${plan.price},00 via PIX</>}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Escaneie o QR Code</h3>
                <p className="text-sm text-muted-foreground">Abra o app do seu banco e escaneie o código abaixo</p>
                <div className="flex justify-center">
                  <img src={pixData.qrCode} alt="QR Code PIX" className="w-56 h-56 rounded-lg border border-border" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Ou copie o código PIX Copia e Cola:</p>
                  <div className="flex gap-2">
                    <Input readOnly value={pixData.pixCopiaECola} className="text-xs font-mono" />
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">ID: {pixData.idCobranca}</p>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-accent font-medium">Após o pagamento, seu acesso será liberado automaticamente.</p>
                </div>
                <Button variant="outline" onClick={() => setPixData(null)}>Gerar novo pagamento</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
