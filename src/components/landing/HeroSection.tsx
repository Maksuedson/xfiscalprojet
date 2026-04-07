import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, FileText } from "lucide-react";
import { useScrollReveal, useCountUp } from "@/hooks/useScrollReveal";

const HeroSection = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal(0.3);
  const notasCount = useCountUp(50000, 2000, true, statsVisible);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveTab((t) => (t + 1) % 4), 3000);
    return () => clearInterval(timer);
  }, []);

  const tabs = ["NF-e Entrada", "NF-e Saída", "NFC-e", "Devoluções"];
  const tabData = [
    { value: "128", growth: "+12%", color: "text-primary" },
    { value: "342", growth: "+23%", color: "text-accent" },
    { value: "89", growth: "+8%", color: "text-primary" },
    { value: "12", growth: "-5%", color: "text-destructive" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
            <Zap size={14} className="animate-pulse" />
            <span>Emissor fiscal inteligente para contadores</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up animate-fade-up-delay-1">
            Emita notas fiscais com{" "}
            <span className="text-gradient-primary">rapidez e segurança</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up animate-fade-up-delay-2">
            Gerencie NF-e, NFC-e, cobranças PIX e todas as suas empresas em um único painel. 
            Simples, rápido e 100% em conformidade fiscal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up animate-fade-up-delay-3">
            <Button variant="hero" size="lg" className="text-base px-8 group"
              onClick={() => document.querySelector("#planos")?.scrollIntoView({ behavior: "smooth" })}>
              Teste grátis por 7 dias
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8"
              onClick={() => document.querySelector("#funcionalidades")?.scrollIntoView({ behavior: "smooth" })}>
              Ver funcionalidades
            </Button>
          </div>

          {/* Animated stats */}
          <div ref={statsRef} className="grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-up animate-fade-up-delay-4">
            {[
              { icon: FileText, value: statsVisible ? `${(notasCount / 1000).toFixed(0)}k+` : "0", label: "Notas emitidas" },
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

        {/* Interactive dashboard mockup */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-up animate-fade-up-delay-4">
          <div className="rounded-2xl shadow-card-hover border border-border overflow-hidden bg-card">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" style={{ filter: "hue-rotate(-60deg)" }} />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-xs mx-auto">
                  emissor.xfiscal.com.br
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Interactive tabs */}
              <div className="flex gap-2 mb-2">
                {tabs.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                      activeTab === i
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Animated metric card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {tabs.map((label, i) => (
                  <div
                    key={label}
                    className={`rounded-xl p-4 transition-all duration-500 ${
                      activeTab === i
                        ? "bg-primary/10 ring-2 ring-primary/30 scale-[1.02]"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className={`text-2xl font-bold ${activeTab === i ? tabData[i].color : "text-foreground"}`}>
                      {tabData[i].value}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">{label}</div>
                    <div className={`text-xs font-semibold mt-1 ${tabData[i].growth.startsWith("+") ? "text-accent" : "text-destructive"}`}>
                      {tabData[i].growth} este mês
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 bg-muted/50 rounded-xl p-4 h-40 flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative transition-all duration-700" style={{ height: `${h}%` }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm transition-all duration-1000"
                        style={{ height: `${h * 0.7}%`, animationDelay: `${i * 80}ms` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-muted/50 rounded-xl p-4 h-40 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray="60 28" strokeLinecap="round" className="transition-all duration-1000" />
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
