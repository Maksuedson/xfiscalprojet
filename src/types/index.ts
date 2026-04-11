export type UserRole = "admin" | "contador" | "emissor";

export interface User {
  id: string;
  nome: string;
  usuario: string;
  role: UserRole;
  empresa?: string;
  id_contador?: string;
  id_empresa?: string;
}

export interface Contador {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  crc: string;
  empresas: number;
  status: "ativo" | "pendente" | "bloqueado" | "cancelado";
  plano: "Starter" | "Pro" | "Enterprise";
  criado: string;
  ultimoPagamento?: string;
}

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  ie: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  uf: string;
  status: "ativa" | "bloqueada" | "inativa";
  idContador: string;
  certificadoStatus: "válido" | "vencendo" | "vencido" | "sem certificado";
  certificadoValidade?: string;
  criado: string;
}

export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  uf: string;
}

export interface Produto {
  id: string;
  nome: string;
  ncm: string;
  cfop: string;
  unidade: string;
  preco: number;
  estoque: number;
}

export interface Fornecedor {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  uf: string;
}

export interface Transportadora {
  id: string;
  nome: string;
  cpfCnpj: string;
  antt: string;
  placa: string;
  uf: string;
}

export interface CertificadoA1 {
  id: string;
  idEmpresa: string;
  nomeEmpresa: string;
  arquivo: string;
  senha: string;
  validade: string;
  status: "válido" | "vencendo" | "vencido";
  uploadEm: string;
  historico: { data: string; acao: string; arquivo: string }[];
}

export interface Cobranca {
  id: string;
  tipo: "plataforma" | "empresa";
  devedorId: string;
  devedorNome: string;
  credorId: string;
  credorNome: string;
  valor: number;
  competencia: string;
  vencimento: string;
  status: "pago" | "pendente" | "vencido" | "cancelado";
  dataPagamento?: string;
  descricao: string;
  criadoEm: string;
}

export interface NotaFiscal {
  id: string;
  numero: string;
  serie: string;
  tipo: "entrada" | "saida" | "devolucao" | "nfce";
  chaveAcesso: string;
  destinatario: string;
  cnpjDestinatario: string;
  cfop: string;
  natOp: string;
  valorTotal: number;
  icms: number;
  ipi: number;
  pis: number;
  cofins: number;
  status: "autorizada" | "cancelada" | "rejeitada" | "pendente";
  dataEmissao: string;
  xml?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  acao: string;
  modulo: string;
  detalhes: string;
  ip: string;
  dataHora: string;
}
