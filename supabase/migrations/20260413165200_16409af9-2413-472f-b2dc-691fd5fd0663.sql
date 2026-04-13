
-- ==================== SUPPLIERS ====================
CREATE TABLE public.suppliers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  nome text NOT NULL,
  cpf_cnpj text DEFAULT '',
  email text DEFAULT '',
  telefone text DEFAULT '',
  endereco text DEFAULT '',
  cidade text DEFAULT '',
  uf text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage suppliers" ON public.suppliers FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can manage own company suppliers" ON public.suppliers FOR ALL USING (company_id IN (SELECT c.id FROM companies c JOIN accountants a ON c.accountant_id = a.id WHERE a.user_id = auth.uid()));
CREATE POLICY "Emissores can manage own suppliers" ON public.suppliers FOR ALL USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== CARRIERS ====================
CREATE TABLE public.carriers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  nome text NOT NULL,
  cpf_cnpj text DEFAULT '',
  antt text DEFAULT '',
  placa text DEFAULT '',
  uf text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage carriers" ON public.carriers FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can manage own company carriers" ON public.carriers FOR ALL USING (company_id IN (SELECT c.id FROM companies c JOIN accountants a ON c.accountant_id = a.id WHERE a.user_id = auth.uid()));
CREATE POLICY "Emissores can manage own carriers" ON public.carriers FOR ALL USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

CREATE TRIGGER update_carriers_updated_at BEFORE UPDATE ON public.carriers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== SALES ====================
CREATE TABLE public.sales (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  numero serial,
  status text NOT NULL DEFAULT 'rascunho',
  subtotal numeric NOT NULL DEFAULT 0,
  desconto numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  forma_pagamento text DEFAULT '',
  observacoes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sales" ON public.sales FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can manage own company sales" ON public.sales FOR ALL USING (company_id IN (SELECT c.id FROM companies c JOIN accountants a ON c.accountant_id = a.id WHERE a.user_id = auth.uid()));
CREATE POLICY "Emissores can manage own sales" ON public.sales FOR ALL USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== SALE ITEMS ====================
CREATE TABLE public.sale_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  nome_produto text NOT NULL,
  quantidade numeric NOT NULL DEFAULT 1,
  preco_unitario numeric NOT NULL DEFAULT 0,
  desconto numeric NOT NULL DEFAULT 0,
  subtotal numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sale_items" ON public.sale_items FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can manage own sale_items" ON public.sale_items FOR ALL USING (sale_id IN (SELECT s.id FROM sales s JOIN companies c ON s.company_id = c.id JOIN accountants a ON c.accountant_id = a.id WHERE a.user_id = auth.uid()));
CREATE POLICY "Emissores can manage own sale_items" ON public.sale_items FOR ALL USING (sale_id IN (SELECT s.id FROM sales s JOIN companies c ON s.company_id = c.id WHERE c.user_id = auth.uid()));
