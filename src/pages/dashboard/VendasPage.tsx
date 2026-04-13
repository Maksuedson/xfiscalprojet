import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, ShoppingCart, Eye, Trash2, Package } from "lucide-react";

const statusColors: Record<string, string> = {
  rascunho: "bg-muted text-muted-foreground",
  finalizada: "bg-primary/10 text-primary",
  faturada: "bg-green-100 text-green-700",
  cancelada: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<string, string> = {
  rascunho: "Rascunho",
  finalizada: "Finalizada",
  faturada: "Faturada",
  cancelada: "Cancelada",
};

interface SaleItem {
  product_id: string;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
  subtotal: number;
}

const VendasPage = () => {
  const { user } = useAuth();
  const { current } = useImpersonation();
  const qc = useQueryClient();
  const companyId = current?.id || user?.id_empresa || "";

  const [showNew, setShowNew] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [filterStatus, setFilterStatus] = useState("todos");

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["sales", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from("sales")
        .select("*, customers(nome)")
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
      const { data, error } = await supabase.from("customers").select("id, nome").eq("company_id", companyId).order("nome");
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase.from("products").select("id, nome, preco, unidade").eq("company_id", companyId).order("nome");
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
        supabase.from("sales").select("*, customers(nome)").eq("id", showDetail).single(),
        supabase.from("sale_items").select("*").eq("sale_id", showDetail).order("created_at"),
      ]);
      if (sale.error) throw sale.error;
      return { ...sale.data, items: saleItems.data || [] };
    },
    enabled: !!showDetail,
  });

  const createSale = useMutation({
    mutationFn: async () => {
      const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
      const totalDesconto = items.reduce((s, i) => s + i.desconto * i.quantidade, 0);
      const total = subtotal - totalDesconto;

      const { data: sale, error } = await supabase
        .from("sales")
        .insert({
          company_id: companyId,
          customer_id: customerId || null,
          subtotal,
          desconto: totalDesconto,
          total,
          forma_pagamento: formaPagamento,
          observacoes,
          status: "rascunho",
        })
        .select()
        .single();
      if (error) throw error;

      if (items.length > 0) {
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
      }
      return sale;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Venda criada com sucesso!");
      resetForm();
    },
    onError: (e: any) => toast.error("Erro ao criar venda: " + e.message),
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
  });

  const resetForm = () => {
    setShowNew(false);
    setCustomerId("");
    setFormaPagamento("");
    setObservacoes("");
    setItems([]);
    setSelectedProduct("");
    setQty(1);
  };

  const addItem = () => {
    const prod = products.find((p: any) => p.id === selectedProduct);
    if (!prod) return;
    setItems((prev) => [
      ...prev,
      {
        product_id: prod.id,
        nome_produto: prod.nome,
        quantidade: qty,
        preco_unitario: Number(prod.preco),
        desconto: 0,
        subtotal: Number(prod.preco) * qty,
      },
    ]);
    setSelectedProduct("");
    setQty(1);
  };

  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const totalVenda = items.reduce((s, i) => s + i.subtotal, 0);

  const filteredSales = filterStatus === "todos" ? sales : sales.filter((s: any) => s.status === filterStatus);

  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesse uma empresa para gerenciar vendas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">PDV / Vendas</h1>
          <p className="text-muted-foreground">Gerencie vendas e use como base para emissão fiscal</p>
        </div>
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" />Nova Venda</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Cliente</label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger><SelectValue placeholder="Selecionar cliente" /></SelectTrigger>
                    <SelectContent>
                      {customers.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Forma de Pagamento</label>
                  <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                      <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Observações</label>
                <Textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Observações da venda..." rows={2} />
              </div>

              <div className="border border-border rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Package size={16} /> Adicionar Produto
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Selecionar produto" /></SelectTrigger>
                    <SelectContent>
                      {products.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nome} — R$ {Number(p.preco).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-20" placeholder="Qtd" />
                  <Button type="button" variant="secondary" onClick={addItem} disabled={!selectedProduct}>
                    <Plus size={14} className="mr-1" />Add
                  </Button>
                </div>

                {items.length > 0 && (
                  <div className="border border-border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left px-3 py-2 text-muted-foreground font-medium">Produto</th>
                          <th className="text-right px-3 py-2 text-muted-foreground font-medium">Qtd</th>
                          <th className="text-right px-3 py-2 text-muted-foreground font-medium">Unitário</th>
                          <th className="text-right px-3 py-2 text-muted-foreground font-medium">Subtotal</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={idx} className="border-t border-border">
                            <td className="px-3 py-2 text-foreground">{item.nome_produto}</td>
                            <td className="text-right px-3 py-2 text-foreground">{item.quantidade}</td>
                            <td className="text-right px-3 py-2 text-foreground">R$ {item.preco_unitario.toFixed(2)}</td>
                            <td className="text-right px-3 py-2 text-foreground font-medium">R$ {item.subtotal.toFixed(2)}</td>
                            <td className="px-3 py-2">
                              <button onClick={() => removeItem(idx)} className="text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex justify-end">
                  <span className="text-lg font-bold text-foreground">Total: R$ {totalVenda.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                <Button onClick={() => createSale.mutate()} disabled={items.length === 0 || createSale.isPending}>
                  {createSale.isPending ? "Salvando..." : "Salvar Venda"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["todos", "rascunho", "finalizada", "faturada", "cancelada"].map((s) => (
          <Button
            key={s}
            variant={filterStatus === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(s)}
          >
            {s === "todos" ? "Todas" : statusLabels[s]}
          </Button>
        ))}
      </div>

      {/* Sales List */}
      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filteredSales.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Nenhuma venda encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSales.map((sale: any) => (
            <Card key={sale.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-foreground">Venda #{sale.numero}</span>
                    <Badge className={statusColors[sale.status]}>{statusLabels[sale.status]}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cliente: {sale.customers?.nome || "Consumidor final"} • {new Date(sale.created_at).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">R$ {Number(sale.total).toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  {sale.status === "rascunho" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: sale.id, status: "finalizada" })}>
                      Finalizar
                    </Button>
                  )}
                  {sale.status === "rascunho" && (
                    <Button size="sm" variant="destructive" onClick={() => updateStatus.mutate({ id: sale.id, status: "cancelada" })}>
                      Cancelar
                    </Button>
                  )}
                  <Dialog open={showDetail === sale.id} onOpenChange={(o) => setShowDetail(o ? sale.id : null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost"><Eye size={14} /></Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Venda #{sale.numero}</DialogTitle>
                      </DialogHeader>
                      {saleDetail && showDetail === sale.id && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-muted-foreground">Status:</span> <Badge className={statusColors[saleDetail.status]}>{statusLabels[saleDetail.status]}</Badge></div>
                            <div><span className="text-muted-foreground">Cliente:</span> {saleDetail.customers?.nome || "Consumidor final"}</div>
                            <div><span className="text-muted-foreground">Pagamento:</span> {saleDetail.forma_pagamento || "—"}</div>
                            <div><span className="text-muted-foreground">Data:</span> {new Date(saleDetail.created_at).toLocaleDateString("pt-BR")}</div>
                          </div>
                          {saleDetail.observacoes && (
                            <div className="text-sm"><span className="text-muted-foreground">Obs:</span> {saleDetail.observacoes}</div>
                          )}
                          <div className="border border-border rounded-md overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Produto</th>
                                  <th className="text-right px-3 py-2 text-muted-foreground font-medium">Qtd</th>
                                  <th className="text-right px-3 py-2 text-muted-foreground font-medium">Unitário</th>
                                  <th className="text-right px-3 py-2 text-muted-foreground font-medium">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {saleDetail.items.map((item: any) => (
                                  <tr key={item.id} className="border-t border-border">
                                    <td className="px-3 py-2 text-foreground">{item.nome_produto}</td>
                                    <td className="text-right px-3 py-2 text-foreground">{Number(item.quantidade)}</td>
                                    <td className="text-right px-3 py-2 text-foreground">R$ {Number(item.preco_unitario).toFixed(2)}</td>
                                    <td className="text-right px-3 py-2 text-foreground font-medium">R$ {Number(item.subtotal).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex justify-end text-lg font-bold text-foreground">
                            Total: R$ {Number(saleDetail.total).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendasPage;
