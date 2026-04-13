
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'contador', 'emissor');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT NOT NULL DEFAULT '',
  telefone TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles (separate table as required)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Accountants
CREATE TABLE public.accountants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT DEFAULT '',
  cpf_cnpj TEXT NOT NULL DEFAULT '',
  crc TEXT DEFAULT '',
  plano TEXT NOT NULL DEFAULT 'Starter' CHECK (plano IN ('Starter', 'Pro', 'Enterprise')),
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'suspenso', 'inativo')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.accountants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can do everything on accountants" ON public.accountants FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can view own record" ON public.accountants FOR SELECT USING (user_id = auth.uid());

-- Companies
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accountant_id UUID REFERENCES public.accountants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT DEFAULT '',
  cnpj TEXT NOT NULL DEFAULT '',
  ie TEXT DEFAULT '',
  email TEXT DEFAULT '',
  telefone TEXT DEFAULT '',
  endereco TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  uf TEXT DEFAULT '' CHECK (char_length(uf) <= 2),
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'bloqueada', 'inativa')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can do everything on companies" ON public.companies FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can manage own companies" ON public.companies FOR ALL USING (
  accountant_id IN (SELECT id FROM public.accountants WHERE user_id = auth.uid())
);
CREATE POLICY "Emissores can view own company" ON public.companies FOR SELECT USING (user_id = auth.uid());

-- Company certificates
CREATE TABLE public.company_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  arquivo_nome TEXT NOT NULL,
  validade DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'valido' CHECK (status IN ('valido', 'vencendo', 'vencido')),
  senha_protegida TEXT DEFAULT '',
  is_current BOOLEAN NOT NULL DEFAULT true,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.company_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage certificates" ON public.company_certificates FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can manage own company certs" ON public.company_certificates FOR ALL USING (
  company_id IN (SELECT c.id FROM public.companies c JOIN public.accountants a ON c.accountant_id = a.id WHERE a.user_id = auth.uid())
);
CREATE POLICY "Emissores can view own cert" ON public.company_certificates FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
);

-- Platform charges (admin -> contador)
CREATE TABLE public.platform_charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accountant_id UUID REFERENCES public.accountants(id) ON DELETE CASCADE NOT NULL,
  competencia TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  vencimento DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pago', 'pendente', 'vencido', 'cancelado')),
  pago_em TIMESTAMPTZ,
  forma_pagamento TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.platform_charges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage platform charges" ON public.platform_charges FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can view own charges" ON public.platform_charges FOR SELECT USING (
  accountant_id IN (SELECT id FROM public.accountants WHERE user_id = auth.uid())
);

-- Company charges (contador -> empresa)
CREATE TABLE public.company_charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  accountant_id UUID REFERENCES public.accountants(id) ON DELETE CASCADE NOT NULL,
  competencia TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  vencimento DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pago', 'pendente', 'vencido', 'cancelado')),
  pago_em TIMESTAMPTZ,
  forma_pagamento TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.company_charges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage company charges" ON public.company_charges FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can manage own company charges" ON public.company_charges FOR ALL USING (
  accountant_id IN (SELECT id FROM public.accountants WHERE user_id = auth.uid())
);
CREATE POLICY "Emissores can view own charges" ON public.company_charges FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
);

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origem_tipo TEXT NOT NULL CHECK (origem_tipo IN ('platform_charge', 'company_charge')),
  origem_id UUID NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmado' CHECK (status IN ('confirmado', 'estornado', 'pendente')),
  metodo TEXT DEFAULT 'pix',
  data_pagamento TIMESTAMPTZ DEFAULT now(),
  comprovante TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can view related payments" ON public.payments FOR SELECT USING (
  (origem_tipo = 'platform_charge' AND origem_id IN (SELECT id FROM public.platform_charges WHERE accountant_id IN (SELECT id FROM public.accountants WHERE user_id = auth.uid())))
  OR
  (origem_tipo = 'company_charge' AND origem_id IN (SELECT id FROM public.company_charges WHERE accountant_id IN (SELECT id FROM public.accountants WHERE user_id = auth.uid())))
);

-- Customers (per company)
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  cpf_cnpj TEXT DEFAULT '',
  email TEXT DEFAULT '',
  telefone TEXT DEFAULT '',
  endereco TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  uf TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage customers" ON public.customers FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can manage own company customers" ON public.customers FOR ALL USING (
  company_id IN (SELECT c.id FROM public.companies c JOIN public.accountants a ON c.accountant_id = a.id WHERE a.user_id = auth.uid())
);
CREATE POLICY "Emissores can manage own customers" ON public.customers FOR ALL USING (
  company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
);

-- Products (per company)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  ncm TEXT DEFAULT '',
  unidade TEXT DEFAULT 'UN',
  preco NUMERIC(10,2) NOT NULL DEFAULT 0,
  cfop TEXT DEFAULT '',
  cst TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contadores can manage own company products" ON public.products FOR ALL USING (
  company_id IN (SELECT c.id FROM public.companies c JOIN public.accountants a ON c.accountant_id = a.id WHERE a.user_id = auth.uid())
);
CREATE POLICY "Emissores can manage own products" ON public.products FOR ALL USING (
  company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
);

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  perfil TEXT DEFAULT '',
  modulo TEXT NOT NULL,
  acao TEXT NOT NULL,
  detalhes TEXT DEFAULT '',
  ip TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Any authenticated can insert logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- System settings
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT NOT NULL UNIQUE,
  valor TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.system_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_accountants_updated_at BEFORE UPDATE ON public.accountants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.company_certificates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
