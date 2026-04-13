import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Plus, ShoppingCart, Eye, Trash2, Package, Search, FileText,
  CheckCircle2, XCircle, Clock, DollarSign, Users, Filter
} from "lucide-react";

// ── Constants ──
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  rascunho: { label: "Rascunho", color: "bg-muted text-muted-foreground", icon: Clock },
  finalizada: { label: "Finalizada", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  faturada: { label: "Faturada", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: FileText },
  cancelada: { label: "Cancelada", color: "bg-destructive/10 text-destructive", icon: XCircle },
};

const PAYMENT_METHODS = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "PIX" },
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "cartao_debito", label: "Cartão de Débito" },
  { value: "boleto", label: "Boleto" },
  { value: "transferencia", label: "Transferência" },
  { value: "outros", label: "Outros" },
];

const paymentLabel = (v: string) => PAYMENT_METHODS.find(p => p.value === v)?.label || v || "—";

// ── Types ──
interface SaleItem {
  product_id: string;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
  subtotal: number;
}

// ── Helper: format BRL ──
const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ── Component ──
const VendasPage = () => {
  const { user } = useAuth();
  const { current } = useImpersonation();
  const qc = useQueryClient();
  const companyId = current?.id || user?.id_empresa || "";

  // ── UI state ──
  const [showNew, setShowNew] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  // ── Filters ──
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("todos");

  // ── New sale form ──
  const [customerId, setCustomerId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [descontoGeral, setDescontoGeral] = useState(0);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);

  // ── Queries ──
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["sales", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from("sales")
        .select("*, customers(nome, cpf_cnpj)")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase.from("customers").select("id, nome, cpf_cnpj, email, telefone").eq("company_id", companyId).order("nome");
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase.from("products").select("id, nome, preco, unidade, ncm").eq("company_id", companyId).order("nome");
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: saleDetail } = useQuery({
    queryKey: ["sale_detail", showDetail],
    queryFn: async () => {
      if (!showDetail) return null;
      const [sale, saleItems] = await Promise.all([
        supabase.from("sales").select("*, customers(nome, cpf_cnpj, email, telefone)").eq("id", showDetail).single(),
        supabase.from("sale_items").select("*").eq("sale_id", showDetail).order("created_at"),
      ]);
      if (sale.error) throw sale.error;
      return { ...sale.data, items: saleItems.data || [] };
    },
    enabled: !!showDetail,
  });

  // ── Mutations ──
  const createSale = useMutation({
    mutationFn: async () => {
      if (items.length === 0) throw new Error("Adicione pelo menos um item.");
      if (items.some(i => i.quantidade <= 0)) throw new Error("Quantidade deve ser maior que zero.");
      if (items.some(i => i.preco_unitario < 0)) throw new Error("Valor unitário inválido.");

      const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
      const descItens = items.reduce((s, i) => s + i.desconto * i.quantidade, 0);
      const descTotal = descItens + descontoGeral;
      const total = Math.max(subtotal - descTotal, 0);

      const { data: sale, error } = await supabase
        .from("sales")
        .insert({
          company_id: companyId,
          customer_id: customerId || null,
          subtotal,
          desconto: descTotal,
          total,
          forma_pagamento: formaPagamento || null,
          observacoes: observacoes || null,
          status: "rascunho",
        })
        .select()
        .single();
      if (error) throw error;

      const { error: itemsError } = await supabase.from("sale_items").insert(
        items.map((i) => ({
          sale_id: sale.id,
          product_id: i.product_id || null,
          nome_produto: i.nome_produto,
          quantidade: i.quantidade,
          preco_unitario: i.preco_unitario,
          desconto: i.desconto,
          subtotal: i.subtotal,
        }))
      );
      if (itemsError) throw itemsError;
      return sale;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Venda criada com sucesso!");
      resetForm();
    },
    onError: (e: any) => toast.error(e.message || "Erro ao criar venda."),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("sales").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["sale_detail"] });
      toast.success("Status atualizado!");
    },
    onError: (e: any) => toast.error(e.message || "Erro ao atualizar."),
  });

  // ── Form helpers ──
  const resetForm = () => {
    setShowNew(false);
    setCustomerId("");
    setCustomerSearch("");
    setFormaPagamento("");
    setObservacoes("");
    setDescontoGeral(0);
    setItems([]);
    setSelectedProduct("");
    setProductSearch("");
    setQty(1);
  };

  const addItem = () => {
    const prod = products.find((p: any) => p.id === selectedProduct);
    if (!prod) return;
    if (qty <= 0) { toast.error("Quantidade deve ser maior que zero."); return; }
    const preco = Number(prod.preco);
    setItems((prev) => [
      ...prev,
      {
        product_id: prod.id,
        nome_produto: prod.nome,
        quantidade: qty,
        preco_unitario: preco,
        desconto: 0,
        subtotal: preco * qty,
      },
    ]);
    setSelectedProduct("");
    setProductSearch("");
    setQty(1);
  };

  const updateItem = (idx: number, field: keyof SaleItem, value: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: value };
      if (field === "quantidade" || field === "preco_unitario" || field === "desconto") {
        updated.subtotal = updated.preco_unitario * updated.quantidade;
      }
      return updated;
    }));
  };

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  // ── Calculations ──
  const subtotalItens = items.reduce((s, i) => s + i.subtotal, 0);
  const descontoItens = items.reduce((s, i) => s + i.desconto * i.quantidade, 0);
  const totalVenda = Math.max(subtotalItens - descontoItens - descontoGeral, 0);

  // ── Filtered lists ──
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter((c: any) =>
      c.nome?.toLowerCase().includes(q) || c.cpf_cnpj?.includes(q)
    );
  }, [customers, customerSearch]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const q = productSearch.toLowerCase();
    return products.filter((p: any) =>
      p.nome?.toLowerCase().includes(q) || p.ncm?.includes(q)
    );
  }, [products, productSearch]);

  const filteredSales = useMemo(() => {
    let result = sales;
    if (filterStatus !== "todos") result = result.filter((s: any) => s.status === filterStatus);
    if (filterPayment !== "todos") result = result.filter((s: any) => s.forma_pagamento === filterPayment);
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      result = result.filter((s: any) =>
        String(s.numero).includes(q) ||
        s.customers?.nome?.toLowerCase().includes(q) ||
        s.customers?.cpf_cnpj?.includes(q)
      );
    }
    return result;
  }, [sales, filterStatus, filterPayment, filterSearch]);

  // ── Stats ──
  const stats = useMemo(() => ({
    total: sales.length,
    rascunho: sales.filter((s: any) => s.status === "rascunho").length,
    finalizada: sales.filter((s: any) => s.status === "finalizada").length,
    faturada: sales.filter((s: any) => s.status === "faturada").length,
    receita: sales.filter((s: any) => s.status === "faturada").reduce((s: number, v: any) => s + Number(v.total), 0),
  }), [sales]);

  // ── Guards ──
  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <ShoppingCart size={48} className="mx-auto text-muted-foreground/30" />
          <p className="text-muted-foreground">Acesse uma empresa para gerenciar vendas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">PDV / Vendas</h1>
          <p className="text-sm text-muted-foreground">Gerencie vendas e use como base para emissão fiscal</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus size={16} className="mr-2" />Nova Venda
        </Button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><ShoppingCart size={20} className="text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Vendas</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted"><Clock size={20} className="text-muted-foreground" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Rascunhos</p>
              <p className="text-xl font-bold text-foreground">{stats.rascunho}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><CheckCircle2 size={20} className="text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Finalizadas</p>
              <p className="text-xl font-bold text-foreground">{stats.finalizada}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30"><DollarSign size={20} className="text-green-700 dark:text-green-400" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Receita Faturada</p>
              <p className="text-xl font-bold text-foreground">{fmt(stats.receita)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Filters ── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente ou CPF/CNPJ..."
                value={filterSearch}
                onChange={e => setFilterSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]"><Filter size={14} className="mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Pagamentos</SelectItem>
                {PAYMENT_METHODS.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Sales Table ── */}
      {isLoading ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Carregando vendas...</CardContent></Card>
      ) : filteredSales.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart size={56} className="text-muted-foreground/20 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Nenhuma venda encontrada</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {filterSearch || filterStatus !== "todos" ? "Tente ajustar os filtros" : "Clique em Nova Venda para começar"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nº</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Pagamento</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Subtotal</TableHead>
                  <TableHead className="text-right font-semibold">Desconto</TableHead>
                  <TableHead className="text-right font-semibold">Total</TableHead>
                  <TableHead className="text-center font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale: any) => {
                  const cfg = STATUS_CONFIG[sale.status] || STATUS_CONFIG.rascunho;
                  return (
                    <TableRow key={sale.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono font-bold">#{sale.numero}</TableCell>
                      <TableCell>{sale.customers?.nome || "Consumidor final"}</TableCell>
                      <TableCell>{new Date(sale.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{paymentLabel(sale.forma_pagamento)}</TableCell>
                      <TableCell><Badge className={cfg.color}>{cfg.label}</Badge></TableCell>
                      <TableCell className="text-right">{fmt(Number(sale.subtotal))}</TableCell>
                      <TableCell className="text-right">{Number(sale.desconto) > 0 ? fmt(Number(sale.desconto)) : "—"}</TableCell>
                      <TableCell className="text-right font-semibold">{fmt(Number(sale.total))}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setShowDetail(sale.id)} title="Detalhes">
                            <Eye size={14} />
                          </Button>
                          {sale.status === "rascunho" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: sale.id, status: "finalizada" })}>
                                Finalizar
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                                if (confirm("Cancelar esta venda?")) updateStatus.mutate({ id: sale.id, status: "cancelada" });
                              }}>
                                <XCircle size={14} />
                              </Button>
                            </>
                          )}
                          {sale.status === "finalizada" && (
                            <Button size="sm" onClick={() => {
                              updateStatus.mutate({ id: sale.id, status: "faturada" });
                              toast.info("Venda faturada! Navegue até Notas Fiscais para emitir a NF-e.");
                            }}>
                              <FileText size={14} className="mr-1" />Emitir NF-e
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* ── MODAL: Nova Venda ── */}
      {/* ══════════════════════════════════════════════ */}
      <Dialog open={showNew} onOpenChange={(o) => { if (!o) resetForm(); else setShowNew(true); }}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShoppingCart size={20} />Nova Venda</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* ── Cliente + Pagamento ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Users size={14} />Cliente <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <Input
                  placeholder="Buscar cliente por nome ou CPF/CNPJ..."
                  value={customerSearch}
                  onChange={e => { setCustomerSearch(e.target.value); if (customerId) setCustomerId(""); }}
                  className="mb-1"
                />
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger><SelectValue placeholder="Selecionar cliente" /></SelectTrigger>
                  <SelectContent>
                    {filteredCustomers.length === 0 ? (
                      <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                        {customers.length === 0 ? "Nenhum cliente cadastrado" : "Nenhum resultado encontrado"}
                      </div>
                    ) : (
                      filteredCustomers.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>
                          <span>{c.nome}</span>
                          {c.cpf_cnpj && <span className="ml-2 text-muted-foreground text-xs">({c.cpf_cnpj})</span>}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Forma de Pagamento</label>
                <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                  <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* ── Itens da Venda ── */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Package size={16} />Itens da Venda
              </h3>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Buscar produto por nome ou NCM..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                  />
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger><SelectValue placeholder="Selecionar produto" /></SelectTrigger>
                    <SelectContent>
                      {filteredProducts.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                          {products.length === 0 ? "Nenhum produto cadastrado" : "Nenhum resultado"}
                        </div>
                      ) : (
                        filteredProducts.map((p: any) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nome} — {fmt(Number(p.preco))} / {p.unidade || "UN"}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Qtd</label>
                    <Input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                      className="w-20"
                    />
                  </div>
                  <Button type="button" variant="secondary" onClick={addItem} disabled={!selectedProduct}>
                    <Plus size={14} className="mr-1" />Adicionar
                  </Button>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum item adicionado</p>
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Produto</TableHead>
                        <TableHead className="w-[90px] text-center">Qtd</TableHead>
                        <TableHead className="w-[120px] text-right">Unitário</TableHead>
                        <TableHead className="w-[100px] text-right">Desc. Un.</TableHead>
                        <TableHead className="w-[120px] text-right">Subtotal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.nome_produto}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={item.quantidade}
                              onChange={e => updateItem(idx, "quantidade", Math.max(1, Number(e.target.value)))}
                              className="w-full text-center h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              value={item.preco_unitario}
                              onChange={e => updateItem(idx, "preco_unitario", Math.max(0, Number(e.target.value)))}
                              className="w-full text-right h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              value={item.desconto}
                              onChange={e => updateItem(idx, "desconto", Math.max(0, Number(e.target.value)))}
                              className="w-full text-right h-8"
                            />
                          </TableCell>
                          <TableCell className="text-right font-semibold">{fmt(item.subtotal)}</TableCell>
                          <TableCell>
                            <button onClick={() => removeItem(idx)} className="text-destructive hover:text-destructive/80 p-1">
                              <Trash2 size={14} />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* ── Observações ── */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Observações</label>
              <Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Observações da venda..." rows={2} />
            </div>

            <Separator />

            {/* ── Resumo Financeiro ── */}
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="text-sm font-semibold text-foreground mb-2">Resumo Financeiro</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} {items.length === 1 ? "item" : "itens"})</span>
                  <span className="text-foreground">{fmt(subtotalItens)}</span>
                </div>
                {descontoItens > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto por item</span>
                    <span className="text-destructive">- {fmt(descontoItens)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Desconto geral</span>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={descontoGeral}
                    onChange={e => setDescontoGeral(Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right h-8"
                  />
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{fmt(totalVenda)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            <Button onClick={() => createSale.mutate()} disabled={items.length === 0 || createSale.isPending}>
              {createSale.isPending ? "Salvando..." : "Salvar Venda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════ */}
      {/* ── MODAL: Detalhe da Venda ── */}
      {/* ══════════════════════════════════════════════ */}
      <Dialog open={!!showDetail} onOpenChange={o => { if (!o) setShowDetail(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {saleDetail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  Venda #{saleDetail.numero}
                  <Badge className={STATUS_CONFIG[saleDetail.status]?.color}>{STATUS_CONFIG[saleDetail.status]?.label}</Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Info grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><span className="text-muted-foreground">Cliente:</span> <span className="font-medium">{saleDetail.customers?.nome || "Consumidor final"}</span></div>
                  {saleDetail.customers?.cpf_cnpj && (
                    <div><span className="text-muted-foreground">CPF/CNPJ:</span> {saleDetail.customers.cpf_cnpj}</div>
                  )}
                  <div><span className="text-muted-foreground">Data:</span> {new Date(saleDetail.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                  <div><span className="text-muted-foreground">Pagamento:</span> {paymentLabel(saleDetail.forma_pagamento)}</div>
                </div>

                {saleDetail.observacoes && (
                  <div className="text-sm bg-muted/30 rounded-lg p-3">
                    <span className="text-muted-foreground font-medium">Observações:</span> {saleDetail.observacoes}
                  </div>
                )}

                <Separator />

                {/* Items table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Unitário</TableHead>
                        <TableHead className="text-right">Desc.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {saleDetail.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.nome_produto}</TableCell>
                          <TableCell className="text-center">{Number(item.quantidade)}</TableCell>
                          <TableCell className="text-right">{fmt(Number(item.preco_unitario))}</TableCell>
                          <TableCell className="text-right">{Number(item.desconto) > 0 ? fmt(Number(item.desconto)) : "—"}</TableCell>
                          <TableCell className="text-right font-semibold">{fmt(Number(item.subtotal))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{fmt(Number(saleDetail.subtotal))}</span>
                    </div>
                    {Number(saleDetail.desconto) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Desconto</span>
                        <span className="text-destructive">- {fmt(Number(saleDetail.desconto))}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{fmt(Number(saleDetail.total))}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  {saleDetail.status === "rascunho" && (
                    <>
                      <Button variant="destructive" size="sm" onClick={() => {
                        if (confirm("Cancelar esta venda?")) {
                          updateStatus.mutate({ id: saleDetail.id, status: "cancelada" });
                          setShowDetail(null);
                        }
                      }}>
                        Cancelar Venda
                      </Button>
                      <Button size="sm" onClick={() => {
                        updateStatus.mutate({ id: saleDetail.id, status: "finalizada" });
                        setShowDetail(null);
                      }}>
                        Finalizar Venda
                      </Button>
                    </>
                  )}
                  {saleDetail.status === "finalizada" && (
                    <Button size="sm" onClick={() => {
                      updateStatus.mutate({ id: saleDetail.id, status: "faturada" });
                      toast.info("Venda faturada! Emita a NF-e em Notas Fiscais.");
                      setShowDetail(null);
                    }}>
                      <FileText size={14} className="mr-1" />Emitir NF-e
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendasPage;
