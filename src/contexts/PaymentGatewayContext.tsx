import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type GatewayProvider = "mercadopago" | "asaas" | "";

export interface GatewayConfig {
  provider: GatewayProvider;
  mercadopago: {
    accessToken: string;
    publicKey: string;
    sandbox: boolean;
  };
  asaas: {
    apiKey: string;
    sandbox: boolean;
    walletId: string;
  };
}

interface PaymentGatewayContextType {
  config: GatewayConfig;
  updateConfig: (config: GatewayConfig) => void;
  isConfigured: boolean;
  generatePixPayment: (params: { valor: number; descricao: string; pagadorNome: string; pagadorCpfCnpj: string }) => Promise<PixPaymentResult>;
}

export interface PixPaymentResult {
  success: boolean;
  qrCode?: string;
  qrCodeBase64?: string;
  pixCopiaECola?: string;
  idCobranca?: string;
  error?: string;
}

const defaultConfig: GatewayConfig = {
  provider: "",
  mercadopago: { accessToken: "", publicKey: "", sandbox: true },
  asaas: { apiKey: "", sandbox: true, walletId: "" },
};

const PaymentGatewayContext = createContext<PaymentGatewayContextType>({} as PaymentGatewayContextType);

export const PaymentGatewayProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<GatewayConfig>(() => {
    const saved = localStorage.getItem("xfiscal_payment_config");
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const updateConfig = useCallback((newConfig: GatewayConfig) => {
    setConfig(newConfig);
    localStorage.setItem("xfiscal_payment_config", JSON.stringify(newConfig));
  }, []);

  const isConfigured = config.provider !== "" && (
    (config.provider === "mercadopago" && config.mercadopago.accessToken !== "") ||
    (config.provider === "asaas" && config.asaas.apiKey !== "")
  );

  const generatePixPayment = useCallback(async (params: { valor: number; descricao: string; pagadorNome: string; pagadorCpfCnpj: string }): Promise<PixPaymentResult> => {
    if (!isConfigured) {
      return { success: false, error: "Gateway de pagamento não configurado. Acesse Configurações > Gateway de Pagamento." };
    }

    // Simulate API call - in production this would call edge functions
    const isSandbox = config.provider === "mercadopago" ? config.mercadopago.sandbox : config.asaas.sandbox;
    
    await new Promise(r => setTimeout(r, 1500));

    const mockId = `PIX_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const pixCode = `00020126580014br.gov.bcb.pix0136${mockId}520400005303986540${params.valor.toFixed(2)}5802BR5913${params.pagadorNome.substring(0, 13)}6008BRASILIA62070503***6304`;

    return {
      success: true,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`,
      pixCopiaECola: pixCode,
      idCobranca: mockId,
    };
  }, [config, isConfigured]);

  return (
    <PaymentGatewayContext.Provider value={{ config, updateConfig, isConfigured, generatePixPayment }}>
      {children}
    </PaymentGatewayContext.Provider>
  );
};

export const usePaymentGateway = () => useContext(PaymentGatewayContext);
