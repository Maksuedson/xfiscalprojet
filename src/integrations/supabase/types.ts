export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accountants: {
        Row: {
          cpf_cnpj: string
          crc: string | null
          created_at: string
          email: string
          id: string
          nome: string
          plano: string
          status: string
          telefone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cpf_cnpj?: string
          crc?: string | null
          created_at?: string
          email: string
          id?: string
          nome: string
          plano?: string
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cpf_cnpj?: string
          crc?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          plano?: string
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          acao: string
          created_at: string
          detalhes: string | null
          id: string
          ip: string | null
          modulo: string
          perfil: string | null
          user_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          detalhes?: string | null
          id?: string
          ip?: string | null
          modulo: string
          perfil?: string | null
          user_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          detalhes?: string | null
          id?: string
          ip?: string | null
          modulo?: string
          perfil?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          accountant_id: string
          cidade: string | null
          cnpj: string
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          ie: string | null
          nome_fantasia: string | null
          razao_social: string
          status: string
          telefone: string | null
          uf: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accountant_id: string
          cidade?: string | null
          cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          ie?: string | null
          nome_fantasia?: string | null
          razao_social: string
          status?: string
          telefone?: string | null
          uf?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accountant_id?: string
          cidade?: string | null
          cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          ie?: string | null
          nome_fantasia?: string | null
          razao_social?: string
          status?: string
          telefone?: string | null
          uf?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_accountant_id_fkey"
            columns: ["accountant_id"]
            isOneToOne: false
            referencedRelation: "accountants"
            referencedColumns: ["id"]
          },
        ]
      }
      company_certificates: {
        Row: {
          arquivo_nome: string
          company_id: string
          id: string
          is_current: boolean
          senha_protegida: string | null
          status: string
          updated_at: string
          uploaded_at: string
          validade: string
        }
        Insert: {
          arquivo_nome: string
          company_id: string
          id?: string
          is_current?: boolean
          senha_protegida?: string | null
          status?: string
          updated_at?: string
          uploaded_at?: string
          validade: string
        }
        Update: {
          arquivo_nome?: string
          company_id?: string
          id?: string
          is_current?: boolean
          senha_protegida?: string | null
          status?: string
          updated_at?: string
          uploaded_at?: string
          validade?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_certificates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_charges: {
        Row: {
          accountant_id: string
          company_id: string
          competencia: string
          created_at: string
          forma_pagamento: string | null
          id: string
          pago_em: string | null
          status: string
          valor: number
          vencimento: string
        }
        Insert: {
          accountant_id: string
          company_id: string
          competencia: string
          created_at?: string
          forma_pagamento?: string | null
          id?: string
          pago_em?: string | null
          status?: string
          valor: number
          vencimento: string
        }
        Update: {
          accountant_id?: string
          company_id?: string
          competencia?: string
          created_at?: string
          forma_pagamento?: string | null
          id?: string
          pago_em?: string | null
          status?: string
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_charges_accountant_id_fkey"
            columns: ["accountant_id"]
            isOneToOne: false
            referencedRelation: "accountants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_charges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          cidade: string | null
          company_id: string
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          uf: string | null
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          company_id: string
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          uf?: string | null
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          company_id?: string
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          uf?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          comprovante: string | null
          created_at: string
          data_pagamento: string | null
          id: string
          metodo: string | null
          origem_id: string
          origem_tipo: string
          status: string
          valor: number
        }
        Insert: {
          comprovante?: string | null
          created_at?: string
          data_pagamento?: string | null
          id?: string
          metodo?: string | null
          origem_id: string
          origem_tipo: string
          status?: string
          valor: number
        }
        Update: {
          comprovante?: string | null
          created_at?: string
          data_pagamento?: string | null
          id?: string
          metodo?: string | null
          origem_id?: string
          origem_tipo?: string
          status?: string
          valor?: number
        }
        Relationships: []
      }
      platform_charges: {
        Row: {
          accountant_id: string
          competencia: string
          created_at: string
          forma_pagamento: string | null
          id: string
          pago_em: string | null
          status: string
          valor: number
          vencimento: string
        }
        Insert: {
          accountant_id: string
          competencia: string
          created_at?: string
          forma_pagamento?: string | null
          id?: string
          pago_em?: string | null
          status?: string
          valor: number
          vencimento: string
        }
        Update: {
          accountant_id?: string
          competencia?: string
          created_at?: string
          forma_pagamento?: string | null
          id?: string
          pago_em?: string | null
          status?: string
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_charges_accountant_id_fkey"
            columns: ["accountant_id"]
            isOneToOne: false
            referencedRelation: "accountants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          cfop: string | null
          company_id: string
          created_at: string
          cst: string | null
          id: string
          ncm: string | null
          nome: string
          preco: number
          unidade: string | null
          updated_at: string
        }
        Insert: {
          cfop?: string | null
          company_id: string
          created_at?: string
          cst?: string | null
          id?: string
          ncm?: string | null
          nome: string
          preco?: number
          unidade?: string | null
          updated_at?: string
        }
        Update: {
          cfop?: string | null
          company_id?: string
          created_at?: string
          cst?: string | null
          id?: string
          ncm?: string | null
          nome?: string
          preco?: number
          unidade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          chave: string
          id: string
          updated_at: string
          valor: string | null
        }
        Insert: {
          chave: string
          id?: string
          updated_at?: string
          valor?: string | null
        }
        Update: {
          chave?: string
          id?: string
          updated_at?: string
          valor?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "contador" | "emissor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "contador", "emissor"],
    },
  },
} as const
