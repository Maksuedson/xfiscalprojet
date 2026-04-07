import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o período de teste grátis?",
    answer: "Você tem 7 dias para testar todas as funcionalidades do plano escolhido sem custo. Não pedimos cartão de crédito para começar.",
  },
  {
    question: "Preciso de certificado digital para emitir notas?",
    answer: "Sim, é necessário um certificado digital A1 válido. Você faz o upload direto no sistema e nós cuidamos da integração com a SEFAZ.",
  },
  {
    question: "Posso migrar minhas empresas de outro sistema?",
    answer: "Sim! Oferecemos importação em lote via planilha para produtos, clientes e dados cadastrais. Nossa equipe de suporte pode ajudar na migração.",
  },
  {
    question: "O sistema funciona com a SEFAZ de todos os estados?",
    answer: "Sim, o xFiscal é homologado com a SEFAZ de todos os estados brasileiros para emissão de NF-e e NFC-e.",
  },
  {
    question: "Como funciona a cobrança PIX automática?",
    answer: "Integramos com o Mercado Pago para gerar cobranças PIX automaticamente para suas empresas. O sistema recebe confirmação de pagamento via webhook em tempo real.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim, sem multa ou fidelidade. Você pode cancelar seu plano a qualquer momento diretamente pelo painel.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 text-foreground">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tire suas dúvidas sobre o xFiscal.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-card px-6 shadow-card data-[state=open]:shadow-card-hover transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
