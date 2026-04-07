import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, FileText } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
            <Zap size={14} />
            <span>Emissor fiscal inteligente para contadores</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up animate-fade-up-delay-1">
            Emita notas fiscais com{" "}
            <span className="text-gradient-primary">rapidez e segurança</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up animate-fade-up-delay-2">
            Gerencie NF-e, NFC-e, cobranças PIX e todas as suas empresas em um único painel. 
            Simples, rápido e 100% em conformidade fiscal.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up animate-fade-up-delay-3">
            <Button variant="hero" size="lg" className="text-base px-8"
              onClick={() => document.querySelector("#planos")?.scrollIntoView({ behavior: "smooth" })}>
              Teste grátis por 7 dias
              <ArrowRight size={18} />
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8"
              onClick={() => document.querySelector("#funcionalidades")?.scrollIntoView({ behavior: "smooth" })}>
              Ver funcionalidades
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-up animate-fade-up-delay-4">
            {[
              { icon: FileText, value: "50k+", label: "Notas emitidas" },
              { icon: Shield, value: "99.9%", label: "Uptime" },
              { icon: Zap, value: "<3s", label: "Emissão média" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 text-primary" size={20} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-up animate-fade-up-delay-4">
          <div className="rounded-2xl shadow-card-hover border border-border overflow-hidden bg-card">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-xs mx-auto">
                  emissor.xfiscal.com.br
                </div>
              </div>
            </div>
            {/* Dashboard content mockup */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "NF-e Entrada", value: "128", color: "bg-primary/10 text-primary" },
                  { label: "NF-e Saída", value: "342", color: "bg-accent/10 text-accent" },
                  { label: "NFC-e", value: "89", color: "bg-orange-100 text-orange-600" },
                  { label: "Devoluções", value: "12", color: "bg-destructive/10 text-destructive" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl p-4 ${item.color}`}>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-xs font-medium opacity-80">{item.label}</div>
                  </div>
                ))}
              </div>
              {/* Chart mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 bg-muted/50 rounded-xl p-4 h-40 flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative" style={{ height: `${h}%` }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm" style={{ height: `${h * 0.7}%` }} />
                    </div>
                  ))}
                </div>
                <div className="bg-muted/50 rounded-xl p-4 h-40 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray="60 28" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--accent))" strokeWidth="4" strokeDasharray="20 68" strokeDashoffset="-60" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground">87%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
