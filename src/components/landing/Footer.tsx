import { Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/xfiscal", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/xfiscal", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/@xfiscal", label: "YouTube" },
  ];

  return (
    <footer id="contato" className="border-t border-border bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">xF</span>
              </div>
              <span className="text-xl font-bold text-foreground">xFiscal</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Sistema de emissão de documentos fiscais para contadores e escritórios contábeis.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Produto</h4>
            <ul className="space-y-2">
              {[
                { label: "Funcionalidades", href: "#funcionalidades" },
                { label: "Planos", href: "#planos" },
                { label: "Depoimentos", href: "#depoimentos" },
                { label: "FAQ", href: "#faq" },
                { label: "Blog", href: "/blog" },
              ].map((item) => (
                <li key={item.label}>
                  {item.href.startsWith("#") ? (
                    <button
                      onClick={() => scrollTo(item.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              {["Termos de uso", "Política de privacidade", "LGPD"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-primary shrink-0" />
                <a href="mailto:suporte@xfiscal.com.br" className="hover:text-foreground transition-colors">suporte@xfiscal.com.br</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-primary shrink-0" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} xFiscal. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Feito com 💙 para contadores brasileiros
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
