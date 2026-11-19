export type CategoryKey =
  | "income"
  | "fixed"
  | "installments"
  | "variable"
  | "investments"
  | "goals";

export type FinanceItem = {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: string;
  notes?: string;
  status?: "paid" | "pending";
  dueDate?: string;
  recurrence?: string;
  paymentMethod?: string;
  totalValue?: number;
  installmentCount?: number;
  paidInstallments?: number;
  firstDueDate?: string;
  initialAmount?: number;
  contributions?: number;
  target?: number;
  targetDate?: string;
};

export type FinanceStore = Record<CategoryKey, FinanceItem[]>;

export const categoryMeta: Record<
  CategoryKey,
  {
    label: string;
    shortLabel: string;
    color: string;
    soft: string;
    description: string;
  }
> = {
  income: {
    label: "Receitas",
    shortLabel: "Receitas",
    color: "#25845f",
    soft: "#e8f4ee",
    description: "Total recebido neste mês",
  },
  fixed: {
    label: "Despesas fixas",
    shortLabel: "Fixas",
    color: "#5f6966",
    soft: "#eff1f0",
    description: "Compromissos recorrentes",
  },
  installments: {
    label: "Parcelamentos",
    shortLabel: "Parcelas",
    color: "#66849b",
    soft: "#eaf0f4",
    description: "Compromissos no período",
  },
  variable: {
    label: "Despesas variáveis",
    shortLabel: "Variáveis",
    color: "#79817e",
    soft: "#f0f1f1",
    description: "Gastos ocasionais no mês",
  },
  investments: {
    label: "Investimentos",
    shortLabel: "Investimentos",
    color: "#db7a35",
    soft: "#fbefe6",
    description: "Valor atual da carteira",
  },
  goals: {
    label: "Metas financeiras",
    shortLabel: "Metas",
    color: "#3c8d68",
    soft: "#e9f3ee",
    description: "Objetivos financeiros totais",
  },
};

export const initialData: FinanceStore = {
  income: [
    {
      id: "inc-1",
      name: "Salário",
      amount: 3500,
      date: "2025-06-05",
      type: "Salário",
      notes: "Pagamento mensal",
    },
    {
      id: "inc-2",
      name: "Projeto de identidade",
      amount: 1200,
      date: "2025-06-12",
      type: "Freelance",
    },
    { id: "inc-3", name: "Renda extra", amount: 500, date: "2025-06-18", type: "Outros" },
  ],
  fixed: [
    {
      id: "fix-1",
      name: "Aluguel",
      amount: 1000,
      date: "2025-06-10",
      dueDate: "2025-06-10",
      type: "Moradia",
      status: "paid",
      recurrence: "Mensal",
      paymentMethod: "PIX",
    },
    {
      id: "fix-2",
      name: "Energia",
      amount: 180,
      date: "2025-06-15",
      dueDate: "2025-06-15",
      type: "Contas",
      status: "paid",
      recurrence: "Mensal",
      paymentMethod: "Débito automático",
    },
    {
      id: "fix-3",
      name: "Internet",
      amount: 100,
      date: "2025-06-18",
      dueDate: "2025-06-18",
      type: "Contas",
      status: "paid",
      recurrence: "Mensal",
      paymentMethod: "Cartão",
    },
    {
      id: "fix-4",
      name: "Faculdade",
      amount: 300,
      date: "2025-06-22",
      dueDate: "2025-06-22",
      type: "Educação",
      status: "pending",
      recurrence: "Mensal",
      paymentMethod: "Boleto",
    },
    {
      id: "fix-5",
      name: "Outras contas",
      amount: 220,
      date: "2025-06-25",
      dueDate: "2025-06-25",
      type: "Outros",
      status: "pending",
      recurrence: "Mensal",
      paymentMethod: "PIX",
    },
  ],
  installments: [
    {
      id: "par-1",
      name: "Notebook",
      amount: 300,
      totalValue: 3000,
      installmentCount: 10,
      paidInstallments: 2,
      date: "2025-06-08",
      firstDueDate: "2025-05-08",
      dueDate: "2025-06-08",
      type: "Eletrônicos",
      status: "paid",
      paymentMethod: "Cartão",
    },
    {
      id: "par-2",
      name: "Smartphone",
      amount: 150,
      totalValue: 1800,
      installmentCount: 12,
      paidInstallments: 4,
      date: "2025-06-14",
      firstDueDate: "2025-03-14",
      dueDate: "2025-06-14",
      type: "Eletrônicos",
      status: "paid",
      paymentMethod: "Cartão",
    },
    {
      id: "par-3",
      name: "Móveis",
      amount: 200,
      totalValue: 2000,
      installmentCount: 10,
      paidInstallments: 3,
      date: "2025-06-24",
      firstDueDate: "2025-04-24",
      dueDate: "2025-06-24",
      type: "Casa",
      status: "pending",
      paymentMethod: "Cartão",
    },
  ],
  variable: [
    {
      id: "var-1",
      name: "Supermercado",
      amount: 400,
      date: "2025-06-07",
      type: "Alimentação",
      paymentMethod: "Cartão",
    },
    {
      id: "var-2",
      name: "Transporte",
      amount: 150,
      date: "2025-06-11",
      type: "Transporte",
      paymentMethod: "PIX",
    },
    {
      id: "var-3",
      name: "Restaurantes",
      amount: 100,
      date: "2025-06-16",
      type: "Alimentação",
      paymentMethod: "Cartão",
    },
    {
      id: "var-4",
      name: "Compras",
      amount: 100,
      date: "2025-06-20",
      type: "Compras",
      paymentMethod: "Cartão",
    },
  ],
  investments: [
    {
      id: "inv-1",
      name: "Reserva de emergência",
      amount: 5000,
      initialAmount: 4000,
      contributions: 1000,
      date: "2025-01-10",
      type: "Reserva",
    },
    {
      id: "inv-2",
      name: "CDB Banco Inter",
      amount: 3000,
      initialAmount: 2700,
      contributions: 300,
      date: "2025-03-12",
      type: "CDB",
    },
    {
      id: "inv-3",
      name: "Tesouro Selic",
      amount: 2000,
      initialAmount: 1800,
      contributions: 200,
      date: "2025-02-18",
      type: "Tesouro",
    },
  ],
  goals: [
    {
      id: "goal-1",
      name: "Reserva de emergência",
      amount: 4000,
      target: 10000,
      date: "2025-01-10",
      targetDate: "2025-12-31",
      type: "Segurança",
    },
    {
      id: "goal-2",
      name: "Entrada da casa",
      amount: 8000,
      target: 20000,
      date: "2025-02-15",
      targetDate: "2027-06-30",
      type: "Patrimônio",
    },
    {
      id: "goal-3",
      name: "Viagem",
      amount: 1000,
      target: 3000,
      date: "2025-04-20",
      targetDate: "2025-11-01",
      type: "Lazer",
    },
  ],
};
