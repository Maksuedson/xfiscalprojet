import { FileText, CreditCard, Users, BarChart3, Shield, Upload, Building2, Bell } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "NF-e e NFC-e",
    description: "Emita notas de entrada, saída, devolução e NFC-e com validação automática na SEFAZ.",
  },
  {
    icon: CreditCard,
    title: "Cobrança PIX",
    description: "Gere cobranças PIX automáticas via Mercado Pago com webhook de confirmação em tempo real.",
  },
  {
    icon: Users,
    title: "Multi-empresa",
    description: "Gerencie dezenas de empresas em um único painel com controle individual de certificados e notas.",
  },
  {
    icon: BarChart3,
    title: "Relatórios completos",
    description: "Relatórios de faturamento, inadimplência, notas emitidas e comparativos mensais.",
  },
  {
    icon: Shield,
    title: "Certificado A1",
    description: "Upload e gestão de certificados digitais A1 com alertas de vencimento.",
  },
  {
    icon: Upload,
    title: "Importação em lote",
    description: "Importe produtos e clientes via planilha para agilizar o cadastro.",
  },
  {
    icon: Building2,
    title: "Painel do contador",
    description: "Dashboard exclusivo para contadores com visão consolidada de todas as empresas.",
  },
  {
    icon: Bell,
    title: "Notificações",
    description: "Alertas automáticos de rejeição, vencimento de certificado e pagamentos pendentes.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="funcionalidades" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Funcionalidades</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 text-foreground">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-muted-foreground text-lg">
            Do cadastro à emissão, do PIX ao relatório. Seu escritório contábil completo na nuvem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl p-6 bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-hero-gradient group-hover:text-primary-foreground transition-all duration-300">
                <feature.icon size={22} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
