import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts: Record<string, { title: string; date: string; readTime: string; tag: string; content: string }> = {
  "como-emitir-nfe-corretamente": {
    title: "Como emitir NF-e corretamente em 2026",
    date: "02 Abr 2026",
    readTime: "5 min",
    tag: "Guia",
    content: `A emissão de Nota Fiscal Eletrônica (NF-e) é obrigatória para a maioria das empresas brasileiras. Em 2026, novas regras da SEFAZ entraram em vigor.\n\nO xFiscal valida automaticamente todos os campos antes do envio, evitando rejeições comuns como GTIN inválido (539), falha no Schema XML (225) e tributação incorreta (694).\n\nCom o sistema, o tempo médio de emissão caiu para menos de 3 segundos, com taxa de aprovação de 99,7% na primeira tentativa.`,
  },
  "pix-cobranca-automatica-contadores": {
    title: "PIX automático: como contadores estão reduzindo inadimplência",
    date: "28 Mar 2026",
    readTime: "4 min",
    tag: "Produto",
    content: `A inadimplência é um dos maiores desafios dos escritórios contábeis. Com o PIX integrado ao xFiscal via Mercado Pago, a cobrança se torna automática.\n\nResultados reais dos nossos clientes:\n• Escritório Mendes: inadimplência caiu de 22% para 3%\n• Silva & Associados: tempo de cobrança reduzido em 85%\n• JC Assessoria: recebimentos no dia subiram de 40% para 91%\n\nA configuração leva apenas 3 passos: conectar o Mercado Pago, definir valores e ativar o envio automático.`,
  },
  "certificado-digital-a1-guia": {
    title: "Certificado Digital A1: tudo que você precisa saber",
    date: "20 Mar 2026",
    readTime: "6 min",
    tag: "Tutorial",
    content: `O certificado digital A1 é essencial para emissão de notas fiscais eletrônicas. É um arquivo .pfx com validade de 1 ano.\n\nNo xFiscal, o upload é simples: acesse o cadastro da empresa, clique em "Certificado Digital", faça upload do .pfx e informe a senha.\n\nO sistema envia alertas automáticos 30 dias, 15 dias e no dia do vencimento, garantindo que você nunca fique sem certificado válido.`,
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? posts[slug] : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link to="/blog"><ArrowLeft size={16} /> Voltar ao blog</Link>
        </Button>

        <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
          {post.tag}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
          <span className="flex items-center gap-1"><Calendar size={14} />{post.date}</span>
          <span className="flex items-center gap-1"><Clock size={14} />{post.readTime}</span>
        </div>

        <div className="prose prose-lg max-w-none text-foreground">
          {post.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
          <h3 className="font-semibold text-foreground mb-2">Pronto para testar o xFiscal?</h3>
          <p className="text-sm text-muted-foreground mb-4">Comece gratuitamente e veja os resultados em 7 dias.</p>
          <Button variant="hero" asChild>
            <Link to="/#planos">Teste grátis por 7 dias</Link>
          </Button>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;
