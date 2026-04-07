import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const posts = [
  {
    slug: "como-emitir-nfe-corretamente",
    title: "Como emitir NF-e corretamente em 2026",
    excerpt: "Guia completo com as regras atualizadas da SEFAZ para emissão de notas fiscais eletrônicas.",
    date: "02 Abr 2026",
    readTime: "5 min",
    tag: "Guia",
  },
  {
    slug: "pix-cobranca-automatica-contadores",
    title: "PIX automático: como contadores estão reduzindo inadimplência",
    excerpt: "Descubra como a cobrança PIX integrada está transformando o fluxo de caixa dos escritórios.",
    date: "28 Mar 2026",
    readTime: "4 min",
    tag: "Produto",
  },
  {
    slug: "certificado-digital-a1-guia",
    title: "Certificado Digital A1: tudo que você precisa saber",
    excerpt: "Entenda como funciona o certificado A1, como fazer upload e evitar problemas de vencimento.",
    date: "20 Mar 2026",
    readTime: "6 min",
    tag: "Tutorial",
  },
];

const BlogSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Blog</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 text-foreground">
            Conteúdo para contadores
          </h2>
          <p className="text-muted-foreground text-lg">
            Artigos, guias e novidades do mundo fiscal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.slug}
              className={`group rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${150 + i * 100}ms` }}
            >
              {/* Colored top bar */}
              <div className="h-1.5 bg-hero-gradient" />
              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 mb-4 self-start">
                  {post.tag}
                </span>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                  <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={`text-center mt-10 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Button variant="heroOutline" asChild>
            <Link to="/blog">
              Ver todos os artigos <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
