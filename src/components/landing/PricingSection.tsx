import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const plans = [
  {
    name: "Starter",
    price: "97",
    description: "Ideal para contadores com até 5 empresas",
    features: ["Até 5 empresas", "NF-e e NFC-e ilimitadas", "Cobrança PIX básica", "Relatórios essenciais", "Suporte por email"],
    variant: "heroOutline" as const,
    popular: false,
  },
  {
    name: "Profissional",
    price: "197",
    description: "Para escritórios em crescimento",
    features: ["Até 30 empresas", "NF-e e NFC-e ilimitadas", "Cobrança PIX automática", "Relatórios avançados com gráficos", "Alertas por email e WhatsApp", "Suporte prioritário"],
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "397",
    description: "Para grandes escritórios contábeis",
    features: ["Empresas ilimitadas", "NF-e e NFC-e ilimitadas", "Cobrança PIX + boleto", "Relatórios com exportação PDF/Excel", "API de integração", "White-label", "Suporte dedicado"],
    variant: "heroOutline" as const,
    popular: false,
  },
];

const PricingSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="planos" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Planos</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 text-foreground">
            Escolha o plano ideal para seu escritório
          </h2>
          <p className="text-muted-foreground text-lg">
            Todos os planos incluem 7 dias grátis. Cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 bg-card border transition-all duration-500 hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary shadow-card-hover scale-[1.02]"
                  : "border-border shadow-card hover:shadow-card-hover"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${150 + i * 120}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-hero-gradient text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    Mais popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">R${plan.price}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} className="w-full" size="lg">
                Começar agora
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
