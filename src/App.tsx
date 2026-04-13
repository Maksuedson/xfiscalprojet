import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import { PaymentGatewayProvider } from "@/contexts/PaymentGatewayContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Public pages
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";
import VendasPage from "./pages/dashboard/VendasPage";

// Dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import EmpresasPage from "./pages/dashboard/EmpresasPage";
import ClientesPage from "./pages/dashboard/ClientesPage";
import ProdutosPage from "./pages/dashboard/ProdutosPage";
import FornecedoresPage from "./pages/dashboard/FornecedoresPage";
import TransportadorasPage from "./pages/dashboard/TransportadorasPage";
import ContadoresPage from "./pages/dashboard/ContadoresPage";
import NFePage from "./pages/dashboard/NFePage";
import NFCePage from "./pages/dashboard/NFCePage";
import PixPage from "./pages/dashboard/PixPage";
import MensalidadesPage from "./pages/dashboard/MensalidadesPage";
import RelatoriosPage from "./pages/dashboard/RelatoriosPage";
import ConfiguracoesPage from "./pages/dashboard/ConfiguracoesPage";

// New pages
import ContadorDetalhePage from "./pages/admin/ContadorDetalhePage";
import CobrancasPlataformaPage from "./pages/admin/CobrancasPlataformaPage";
import AuditoriaPage from "./pages/admin/AuditoriaPage";
import EmpresaDetalhePage from "./pages/contador/EmpresaDetalhePage";
import CobrancasEmpresasPage from "./pages/contador/CobrancasEmpresasPage";
import CertificadosPage from "./pages/contador/CertificadosPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ImpersonationProvider>
        <PaymentGatewayProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="empresas" element={<EmpresasPage />} />
              <Route path="clientes" element={<ClientesPage />} />
              <Route path="produtos" element={<ProdutosPage />} />
              <Route path="fornecedores" element={<FornecedoresPage />} />
              <Route path="transportadoras" element={<TransportadorasPage />} />
              <Route path="contadores" element={<ContadoresPage />} />
              <Route path="contadores/:id" element={<ContadorDetalhePage />} />
              <Route path="empresas/:id" element={<EmpresaDetalhePage />} />
              <Route path="cobrancas-plataforma" element={<CobrancasPlataformaPage />} />
              <Route path="cobrancas-empresas" element={<CobrancasEmpresasPage />} />
              <Route path="certificados" element={<CertificadosPage />} />
              <Route path="auditoria" element={<AuditoriaPage />} />
              <Route path="nfe/:tipo" element={<NFePage />} />
              <Route path="nfce" element={<NFCePage />} />
              <Route path="pix" element={<PixPage />} />
              <Route path="mensalidades" element={<MensalidadesPage />} />
              <Route path="vendas" element={<VendasPage />} />
              <Route path="relatorios" element={<RelatoriosPage />} />
              <Route path="configuracoes" element={<ConfiguracoesPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PaymentGatewayProvider>
      </ImpersonationProvider>
    </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
