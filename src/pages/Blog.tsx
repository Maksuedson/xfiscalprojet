import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const allPosts = [
  {
    slug: "como-emitir-nfe-corretamente",
    title: "Como emitir NF-e corretamente em 2026",
    excerpt: "Guia completo com as regras atualizadas da SEFAZ para emissão de notas fiscais eletrônicas. Aprenda o passo a passo para evitar rejeições.",
    date: "02 Abr 2026",
    readTime: "5 min",
    tag: "Guia",
    content: `
A emissão de Nota Fiscal Eletrônica (NF-e) é obrigatória para a maioria das empresas brasileiras. Em 2026, novas regras da SEFAZ entraram em vigor, e é essencial que contadores estejam atualizados.

## Principais mudanças em 2026

1. **Novo layout 4.1** – Campos adicionais para rastreabilidade de produtos
2. **Validação de GTIN** – Obrigatória para produtos com código de barras
3. **Eventos obrigatórios** – Manifestação do destinatário com prazo reduzido

## Passo a passo para emissão correta

### 1. Cadastro da empresa
Certifique-se de que o CNPJ, Inscrição Estadual e regime tributário estão corretos no sistema.

### 2. Upload do certificado A1
O certificado digital A1 deve estar válido e dentro do prazo de validade.

### 3. Configuração tributária
Defina corretamente o CFOP, CST/CSOSN, NCM e alíquotas para cada produto.

### 4. Emissão e transmissão
Após preencher todos os campos, o xFiscal valida automaticamente os dados antes de enviar à SEFAZ.

## Erros mais comuns

- **Rejeição 539**: GTIN inválido
- **Rejeição 225**: Falha no Schema XML
- **Rejeição 694**: Não informado o grupo de tributação

Com o xFiscal, a maioria desses erros é evitada automaticamente através de validações em tempo real.
    `,
  },
  {
    slug: "pix-cobranca-automatica-contadores",
    title: "PIX automático: como contadores estão reduzindo inadimplência",
    excerpt: "Descubra como a cobrança PIX integrada está transformando o fluxo de caixa dos escritórios contábeis.",
    date: "28 Mar 2026",
    readTime: "4 min",
    tag: "Produto",
    content: `
A inadimplência é um dos maiores desafios dos escritórios contábeis. Com o PIX integrado ao xFiscal, contadores conseguem reduzir drasticamente os atrasos nos pagamentos.

## Como funciona

O xFiscal gera cobranças PIX automaticamente via Mercado Pago. Quando a fatura é gerada, o QR Code PIX é enviado para o cliente por email ou WhatsApp.

## Resultados reais

- **Escritório Mendes**: inadimplência caiu de 22% para 3%
- **Silva & Associados**: tempo de cobrança reduzido em 85%
- **JC Assessoria**: recebimentos no dia subiram de 40% para 91%

## Configuração em 3 passos

1. Conecte sua conta Mercado Pago
2. Configure os valores e datas de vencimento
3. Ative o envio automático

O webhook de confirmação avisa o sistema em tempo real quando o pagamento é confirmado.
    `,
  },
  {
    slug: "certificado-digital-a1-guia",
    title: "Certificado Digital A1: tudo que você precisa saber",
    excerpt: "Entenda como funciona o certificado A1, como fazer upload e evitar problemas de vencimento.",
    date: "20 Mar 2026",
    readTime: "6 min",
    tag: "Tutorial",
    content: `
O certificado digital A1 é essencial para a emissão de notas fiscais eletrônicas. Ele garante a autenticidade e integridade dos documentos fiscais.

## O que é o Certificado A1?

É um arquivo digital (.pfx) que fica armazenado no computador ou sistema. Tem validade de 1 ano e é emitido por autoridades certificadoras credenciadas.

## Como fazer upload no xFiscal

1. Acesse o cadastro da empresa
2. Clique em "Certificado Digital"
3. Faça upload do arquivo .pfx
4. Informe a senha do certificado
5. O sistema valida automaticamente

## Alertas de vencimento

O xFiscal envia notificações automáticas:
- **30 dias antes** do vencimento
- **15 dias antes** do vencimento
- **No dia** do vencimento

## Dicas importantes

- Sempre mantenha um backup seguro do certificado
- Não compartilhe a senha com terceiros
- Renove com antecedência para evitar interrupções
    `,
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link to="/"><ArrowLeft size={16} /> Voltar</Link>
        </Button>

        <div className="max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blog xFiscal</h1>
          <p className="text-lg text-muted-foreground">Artigos, guias e novidades para contadores.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {allPosts.map((post) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.slug}
              className="group rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <div className="h-1.5 bg-hero-gradient" />
              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 mb-4 self-start">
                  {post.tag}
                </span>
                <h2 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                  <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
