import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Mendes",
    role: "Contador · Mendes Contabilidade",
    avatar: "CM",
    quote: "O xFiscal reduziu em 70% o tempo que gastávamos emitindo notas. Gerenciar 25 empresas ficou simples.",
    stars: 5,
  },
  {
    name: "Ana Paula Silva",
    role: "Sócia · Silva & Associados",
    avatar: "AS",
    quote: "A cobrança PIX automática mudou nosso fluxo de caixa. Inadimplência caiu de 18% para 4% em 3 meses.",
    stars: 5,
  },
  {
    name: "Roberto Ferreira",
    role: "Diretor · Ferreira Escritório Contábil",
    avatar: "RF",
    quote: "Migramos de outro sistema em um dia. O suporte acompanhou cada etapa. Muito profissional.",
    stars: 5,
  },
  {
    name: "Juliana Costa",
    role: "Contadora · JC Assessoria",
    avatar: "JC",
    quote: "Os relatórios avançados me permitem tomar decisões rápidas. Meus clientes adoram a transparência.",
    stars: 5,
  },
];

const stats = [
  { value: "500+", label: "Escritórios ativos" },
  { value: "50.000+", label: "Notas emitidas/mês" },
  { value: "99,9%", label: "Uptime garantido" },
  { value: "4.9/5", label: "Avaliação média" },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="depoimentos" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Depoimentos</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 text-foreground">
            Quem usa, recomenda
          </h2>
          <p className="text-muted-foreground text-lg">
            Veja o que nossos clientes dizem sobre o xFiscal.
          </p>
        </div>

        {/* Stats bar */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative rounded-2xl p-6 bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <Quote size={28} className="absolute top-5 right-5 text-primary/10" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-hero-gradient flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
