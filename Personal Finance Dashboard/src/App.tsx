import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  categoryMeta,
  initialData,
  type CategoryKey,
  type FinanceItem,
  type FinanceStore,
} from "./financeData";

type IconName =
  | "income"
  | "fixed"
  | "installments"
  | "variable"
  | "investments"
  | "goals"
  | "plus"
  | "calendar"
  | "user"
  | "close"
  | "edit"
  | "trash"
  | "check"
  | "chevron"
  | "wallet";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const categoryOrder: CategoryKey[] = [
  "income",
  "fixed",
  "installments",
  "variable",
  "investments",
  "goals",
];

const colors: Record<CategoryKey, string[]> = {
  income: ["#176948", "#27845f", "#58a37f", "#8bc5a9", "#b9ddcb"],
  fixed: ["#48514e", "#66706c", "#858d8a", "#a8aeac", "#cbd0ce"],
  installments: ["#496f89", "#668aa2", "#8ca8ba", "#b4c6d1", "#d5e0e6"],
  variable: ["#505956", "#707875", "#919895", "#b2b7b5", "#d1d4d3"],
  investments: ["#d56d28", "#e49a3e", "#d9b646", "#7f9e78", "#6f819f"],
  goals: ["#2c805c", "#62a685", "#a6cdb9", "#d9dfdc"],
};

const blankItem: FinanceItem = {
  id: "",
  name: "",
  amount: 0,
  date: "2025-06-24",
  type: "",
  status: "pending",
  paymentMethod: "",
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    income: (
      <>
        <path d="M12 3v15" />
        <path d="m7 8 5-5 5 5" />
        <path d="M5 21h14" />
      </>
    ),
    fixed: (
      <>
        <path d="M4 4h16v16H4z" />
        <path d="M8 9h8M8 13h8M8 17h4" />
      </>
    ),
    installments: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </>
    ),
    variable: (
      <>
        <path d="M5 19V9M12 19V5M19 19v-7" />
        <path d="M3 19h18" />
      </>
    ),
    investments: (
      <>
        <path d="m3 17 6-6 4 4 8-9" />
        <path d="M15 6h6v6" />
      </>
    ),
    goals: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    edit: (
      <>
        <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10Z" />
        <path d="m14 7 3 3" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    wallet: (
      <>
        <path d="M3 6h16a2 2 0 0 1 2 2v11H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h15" />
        <path d="M16 11h6v5h-6a2.5 2.5 0 0 1 0-5Z" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function shortMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: value >= 10000 ? 1 : 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "—";
  return value.split("-").reverse().join("/");
}

function loadData(): FinanceStore {
  try {
    const stored = localStorage.getItem("my-finance-data-v1");
    return stored ? JSON.parse(stored) : initialData;
  } catch {
    return initialData;
  }
}

function CategoryCard({
  category,
  total,
  count,
  active,
  subtitle,
  onSelect,
  onAdd,
  onDetails,
}: {
  category: CategoryKey;
  total: number;
  count: number;
  active: boolean;
  subtitle: string;
  onSelect: () => void;
  onAdd: () => void;
  onDetails: () => void;
}) {
  const meta = categoryMeta[category];
  return (
    <article
      className={`finance-card finance-card--${category} ${active ? "is-active" : ""}`}
      onClick={onSelect}
      style={{ "--accent": meta.color, "--soft": meta.soft } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="category-icon">
          <Icon name={category} size={18} />
        </span>
        <span className="item-pill">
          {count} {count === 1 ? "item" : "itens"}
        </span>
      </div>
      <div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7b8581]">
          {meta.label}
        </p>
        <p className="mt-1.5 text-[25px] font-semibold tracking-[-0.045em] text-[#182520]">
          {shortMoney(total)}
        </p>
        <p className="mt-1 min-h-4 text-[10px] text-[#8b9490]">{subtitle}</p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#edf0ee] pt-3">
        <button
          className="card-link"
          onClick={(event) => {
            event.stopPropagation();
            onDetails();
          }}
        >
          Ver detalhes <Icon name="chevron" size={13} />
        </button>
        <button
          className="card-add"
          aria-label={`Adicionar em ${meta.label}`}
          onClick={(event) => {
            event.stopPropagation();
            onAdd();
          }}
        >
          <Icon name="plus" size={15} />
        </button>
      </div>
    </article>
  );
}

function ChartTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>;
  total: number;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  return (
    <div className="chart-tooltip">
      <span
        className="mb-2 block h-2 w-2 rounded-full"
        style={{ background: point.payload.fill }}
      />
      <p className="text-[11px] text-[#808a86]">{point.name}</p>
      <p className="mt-0.5 text-sm font-semibold">{money(point.value)}</p>
      <p className="mt-1 text-[10px] text-[#929b97]">
        {total ? ((point.value / total) * 100).toFixed(1).replace(".", ",") : "0"}% do total
      </p>
    </div>
  );
}

function App() {
  const [data, setData] = useState<FinanceStore>(loadData);
  const [selected, setSelected] = useState<CategoryKey>("income");
  const [month, setMonth] = useState(5);
  const [year, setYear] = useState(2025);
  const [modal, setModal] = useState<"form" | "details" | "quick" | null>(null);
  const [modalCategory, setModalCategory] = useState<CategoryKey>("income");
  const [editing, setEditing] = useState<FinanceItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("my-finance-data-v1", JSON.stringify(data));
  }, [data]);

  const periodData = useMemo(() => {
    const result = {} as FinanceStore;
    categoryOrder.forEach((key) => {
      result[key] =
        key === "investments" || key === "goals"
          ? data[key]
          : data[key].filter((item) => {
              const date = new Date(`${item.date}T12:00:00`);
              return date.getMonth() === month && date.getFullYear() === year;
            });
    });
    return result;
  }, [data, month, year]);

  const sum = (key: CategoryKey, predicate?: (item: FinanceItem) => boolean) =>
    periodData[key].filter(predicate ?? (() => true)).reduce((acc, item) => acc + item.amount, 0);

  const totals: Record<CategoryKey, number> = {
    income: sum("income"),
    fixed: sum("fixed"),
    installments: sum("installments"),
    variable: sum("variable"),
    investments: sum("investments"),
    goals: periodData.goals.reduce((acc, item) => acc + (item.target ?? 0), 0),
  };

  const fixedPaid = sum("fixed", (item) => item.status === "paid");
  const fixedPending = sum("fixed", (item) => item.status !== "paid");
  const installmentsPaid = sum("installments", (item) => item.status === "paid");
  const installmentOutstanding = periodData.installments.reduce(
    (acc, item) =>
      acc + Math.max(0, (item.totalValue ?? 0) - (item.paidInstallments ?? 0) * item.amount),
    0,
  );
  const contributions = periodData.investments.reduce(
    (acc, item) => acc + (item.contributions ?? 0),
    0,
  );
  const availableBalance =
    totals.income - fixedPaid - totals.variable - installmentsPaid - contributions;
  const goalsSaved = sum("goals");

  const chartData = useMemo(() => {
    if (selected === "goals") {
      return [
        ...periodData.goals.map((item, index) => ({
          name: item.name,
          value: item.amount,
          fill: colors.goals[index % 3],
        })),
        {
          name: "Valor restante",
          value: Math.max(0, totals.goals - goalsSaved),
          fill: "#d8ddda",
        },
      ].filter((item) => item.value > 0);
    }
    return periodData[selected].map((item, index) => ({
      name: item.name,
      value: item.amount,
      fill: colors[selected][index % colors[selected].length],
    }));
  }, [selected, periodData, totals.goals, goalsSaved]);

  const chartTotal = chartData.reduce((acc, item) => acc + item.value, 0);

  const openForm = (category: CategoryKey, item?: FinanceItem) => {
    setModalCategory(category);
    setEditing(item ?? null);
    setModal("form");
  };

  const openDetails = (category: CategoryKey) => {
    setSelected(category);
    setModalCategory(category);
    setModal("details");
  };

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const saveItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const amount = Number(String(values.get("amount")).replace(",", ".")) || 0;
    const count = Number(values.get("installmentCount")) || 1;
    const totalValue = Number(String(values.get("totalValue")).replace(",", ".")) || amount * count;
    const target = Number(String(values.get("target")).replace(",", ".")) || 0;
    if (!String(values.get("name") ?? "").trim() || amount <= 0) {
      flash("Preencha o nome e um valor válido.");
      return;
    }
    const item: FinanceItem = {
      ...blankItem,
      ...(editing ?? {}),
      id: editing?.id ?? `${modalCategory}-${Date.now()}`,
      name: String(values.get("name")),
      amount,
      date: String(values.get("date") || "2025-06-24"),
      type: String(values.get("type") || "Outros"),
      notes: String(values.get("notes") || ""),
      status: String(values.get("status") || "pending") as "paid" | "pending",
      dueDate: String(values.get("dueDate") || ""),
      recurrence: String(values.get("recurrence") || ""),
      paymentMethod: String(values.get("paymentMethod") || ""),
      totalValue,
      installmentCount: count,
      paidInstallments: Number(values.get("paidInstallments")) || 0,
      firstDueDate: String(values.get("firstDueDate") || ""),
      initialAmount: Number(values.get("initialAmount")) || amount,
      contributions: Number(values.get("contributions")) || 0,
      target,
      targetDate: String(values.get("targetDate") || ""),
    };
    setData((current) => ({
      ...current,
      [modalCategory]: editing
        ? current[modalCategory].map((entry) => (entry.id === editing.id ? item : entry))
        : [...current[modalCategory], item],
    }));
    setSelected(modalCategory);
    setModal(null);
    flash(editing ? "Registro atualizado com sucesso." : "Registro adicionado com sucesso.");
  };

  const removeItem = (category: CategoryKey, id: string) => {
    setData((current) => ({
      ...current,
      [category]: current[category].filter((item) => item.id !== id),
    }));
    flash("Registro removido.");
  };

  const markPaid = (category: CategoryKey, item: FinanceItem) => {
    setData((current) => ({
      ...current,
      [category]: current[category].map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              status: "paid",
              paidInstallments:
                category === "installments"
                  ? Math.min(entry.installmentCount ?? 1, (entry.paidInstallments ?? 0) + 1)
                  : entry.paidInstallments,
            }
          : entry,
      ),
    }));
    flash("Pagamento confirmado.");
  };

  const adjustGoal = (item: FinanceItem, delta: number) => {
    setData((current) => ({
      ...current,
      goals: current.goals.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              amount: Math.max(0, Math.min(entry.target ?? Infinity, entry.amount + delta)),
            }
          : entry,
      ),
    }));
    flash(
      delta > 0
        ? `${money(delta)} adicionados à meta.`
        : `${money(Math.abs(delta))} retirados da meta.`,
    );
  };

  const categorySubtitle: Record<CategoryKey, string> = {
    income: `${money(availableBalance)} disponíveis`,
    fixed: `${money(fixedPaid)} pago · ${money(fixedPending)} pendente`,
    installments: `${money(installmentOutstanding)} saldo futuro`,
    variable: `${periodData.variable.length} lançamentos no mês`,
    investments: `${money(contributions)} em aportes`,
    goals: `${Math.round((goalsSaved / (totals.goals || 1)) * 100)}% concluído`,
  };

  return (
    <div className="min-h-screen bg-[#f5f6f4] text-[#19251f]">
      <header className="dashboard-header">
        <div className="flex items-center gap-3">
          <div className="brand-mark">
            <Icon name="wallet" size={19} />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-[0.12em]">MY FINANCE</p>
            <p className="hidden text-[9px] text-[#89928e] sm:block">Seu dinheiro, com clareza.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="period-select">
            <Icon name="calendar" size={15} />
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              aria-label="Mês"
            >
              {months.map((name, index) => (
                <option value={index} key={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              aria-label="Ano"
            >
              {[2024, 2025, 2026].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <button className="quick-add" onClick={() => setModal("quick")}>
            <Icon name="plus" size={16} />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
          <button className="profile-button" aria-label="Perfil">
            <Icon name="user" size={17} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1450px] px-4 pb-8 pt-5 md:px-7">
        <div className="mb-4 flex items-end justify-between px-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
              Visão geral
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.035em] md:text-2xl">
              Sua vida financeira em um só lugar
            </h1>
          </div>
          <div className="hidden text-right lg:block">
            <p className="text-[10px] text-[#8b9490]">Saldo disponível</p>
            <p
              className={`text-lg font-semibold ${availableBalance < 0 ? "text-[#a95749]" : "text-[#277456]"}`}
            >
              {money(availableBalance)}
            </p>
          </div>
        </div>

        <section className="finance-layout" aria-label="Painel financeiro">
          <div className="area-income">
            <CategoryCard
              category="income"
              total={totals.income}
              count={periodData.income.length}
              active={selected === "income"}
              subtitle={categorySubtitle.income}
              onSelect={() => setSelected("income")}
              onAdd={() => openForm("income")}
              onDetails={() => openDetails("income")}
            />
          </div>
          <div className="area-fixed">
            <CategoryCard
              category="fixed"
              total={totals.fixed}
              count={periodData.fixed.length}
              active={selected === "fixed"}
              subtitle={categorySubtitle.fixed}
              onSelect={() => setSelected("fixed")}
              onAdd={() => openForm("fixed")}
              onDetails={() => openDetails("fixed")}
            />
          </div>
          <div className="area-investments">
            <CategoryCard
              category="investments"
              total={totals.investments}
              count={periodData.investments.length}
              active={selected === "investments"}
              subtitle={categorySubtitle.investments}
              onSelect={() => setSelected("investments")}
              onAdd={() => openForm("investments")}
              onDetails={() => openDetails("investments")}
            />
          </div>
          <div className="area-goals">
            <CategoryCard
              category="goals"
              total={totals.goals}
              count={periodData.goals.length}
              active={selected === "goals"}
              subtitle={categorySubtitle.goals}
              onSelect={() => setSelected("goals")}
              onAdd={() => openForm("goals")}
              onDetails={() => openDetails("goals")}
            />
          </div>
          <div className="area-installments">
            <CategoryCard
              category="installments"
              total={totals.installments}
              count={periodData.installments.length}
              active={selected === "installments"}
              subtitle={categorySubtitle.installments}
              onSelect={() => setSelected("installments")}
              onAdd={() => openForm("installments")}
              onDetails={() => openDetails("installments")}
            />
          </div>
          <div className="area-variable">
            <CategoryCard
              category="variable"
              total={totals.variable}
              count={periodData.variable.length}
              active={selected === "variable"}
              subtitle={categorySubtitle.variable}
              onSelect={() => setSelected("variable")}
              onAdd={() => openForm("variable")}
              onDetails={() => openDetails("variable")}
            />
          </div>

          <section className="chart-panel">
            <div className="chart-heading">
              <span className="chart-accent" style={{ background: categoryMeta[selected].color }} />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b9490]">
                  Distribuição
                </p>
                <h2 className="mt-0.5 text-base font-semibold">{categoryMeta[selected].label}</h2>
              </div>
            </div>
            <div className="chart-shell">
              {chartData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="62%"
                      outerRadius="87%"
                      paddingAngle={3}
                      cornerRadius={8}
                      stroke="#fff"
                      strokeWidth={3}
                      isAnimationActive
                      animationDuration={550}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} className="donut-segment" />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip total={chartTotal} />} cursor={false} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid h-full place-items-center text-xs text-[#929b97]">
                  Sem registros neste período.
                </div>
              )}
              <div className="chart-center">
                <p>{categoryMeta[selected].shortLabel}</p>
                <strong>{money(selected === "goals" ? totals.goals : totals[selected])}</strong>
                <span>{categoryMeta[selected].description}</span>
              </div>
            </div>
            <div className="chart-legend">
              {chartData.slice(0, 4).map((item) => (
                <div key={item.name}>
                  <span style={{ background: item.fill }} />
                  <p>{item.name}</p>
                  <strong>{Math.round((item.value / (chartTotal || 1)) * 100)}%</strong>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      {modal === "quick" && (
        <Modal
          title="O que deseja adicionar?"
          subtitle="Escolha uma categoria para continuar."
          onClose={() => setModal(null)}
          compact
        >
          <div className="grid grid-cols-2 gap-3">
            {categoryOrder.map((category) => (
              <button
                key={category}
                className="quick-option"
                onClick={() => openForm(category)}
                style={
                  {
                    "--accent": categoryMeta[category].color,
                    "--soft": categoryMeta[category].soft,
                  } as React.CSSProperties
                }
              >
                <span>
                  <Icon name={category} />
                </span>
                {categoryMeta[category].label}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {modal === "form" && (
        <Modal
          title={
            editing
              ? `Editar ${categoryMeta[modalCategory].shortLabel}`
              : `Adicionar ${categoryMeta[modalCategory].shortLabel}`
          }
          subtitle="Os dados serão salvos automaticamente neste dispositivo."
          onClose={() => setModal(null)}
        >
          <FinanceForm
            category={modalCategory}
            item={editing ?? blankItem}
            onSubmit={saveItem}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal === "details" && (
        <Modal
          title={categoryMeta[modalCategory].label}
          subtitle={`${periodData[modalCategory].length} registros · ${money(totals[modalCategory])}`}
          onClose={() => setModal(null)}
          wide
        >
          <div className="mb-4 flex justify-end">
            <button className="secondary-add" onClick={() => openForm(modalCategory)}>
              <Icon name="plus" size={14} /> Novo registro
            </button>
          </div>
          <div className="records-list">
            {periodData[modalCategory].length === 0 && (
              <p className="py-10 text-center text-sm text-[#8a9490]">
                Nenhum registro neste período.
              </p>
            )}
            {periodData[modalCategory].map((item) => (
              <div className="record-row" key={item.id}>
                <div className="record-main">
                  <span
                    className="record-dot"
                    style={{ background: categoryMeta[modalCategory].color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="mt-0.5 text-[10px] text-[#8a9490]">
                      {item.type} · {formatDate(item.date)}
                      {item.status ? ` · ${item.status === "paid" ? "Pago" : "Pendente"}` : ""}
                    </p>
                  </div>
                  <strong className="text-sm">
                    {money(modalCategory === "goals" ? (item.target ?? 0) : item.amount)}
                  </strong>
                </div>
                {modalCategory === "installments" && (
                  <div className="installment-summary">
                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="flex w-full items-center justify-between"
                    >
                      <span>
                        {item.paidInstallments ?? 0} de {item.installmentCount ?? 1} parcelas pagas
                      </span>
                      <span>
                        {Math.round(
                          ((item.paidInstallments ?? 0) / (item.installmentCount ?? 1)) * 100,
                        )}
                        %
                      </span>
                    </button>
                    <div className="progress-track">
                      <span
                        style={{
                          width: `${((item.paidInstallments ?? 0) / (item.installmentCount ?? 1)) * 100}%`,
                        }}
                      />
                    </div>
                    {expandedId === item.id && (
                      <InstallmentList
                        item={item}
                        onMarkPaid={() => markPaid("installments", item)}
                      />
                    )}
                  </div>
                )}
                {modalCategory === "goals" && (
                  <div className="installment-summary">
                    <div className="flex justify-between">
                      <span>{money(item.amount)} economizados</span>
                      <span>{Math.round((item.amount / (item.target || 1)) * 100)}%</span>
                    </div>
                    <div className="progress-track goals">
                      <span
                        style={{
                          width: `${Math.min(100, (item.amount / (item.target || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="record-actions">
                  {(modalCategory === "fixed" || modalCategory === "installments") &&
                    item.status !== "paid" && (
                      <button onClick={() => markPaid(modalCategory, item)}>
                        <Icon name="check" size={14} /> Marcar como pago
                      </button>
                    )}
                  {modalCategory === "goals" && (
                    <>
                      <button onClick={() => adjustGoal(item, 100)}>
                        <Icon name="plus" size={14} /> Aportar R$ 100
                      </button>
                      <button onClick={() => adjustGoal(item, -100)}>Retirar R$ 100</button>
                    </>
                  )}
                  <button onClick={() => openForm(modalCategory, item)} aria-label="Editar">
                    <Icon name="edit" size={15} />
                  </button>
                  <button
                    className="danger"
                    onClick={() => removeItem(modalCategory, item.id)}
                    aria-label="Excluir"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {toast && (
        <div className="toast">
          <Icon name="check" size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
  compact = false,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className={`modal-card ${wide ? "max-w-[720px]" : compact ? "max-w-[470px]" : "max-w-[590px]"}`}
      >
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button onClick={onClose} aria-label="Fechar">
            <Icon name="close" size={17} />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`form-field ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function FinanceForm({
  category,
  item,
  onSubmit,
  onCancel,
}: {
  category: CategoryKey;
  item: FinanceItem;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="finance-form">
      <div className="form-grid">
        <Field
          label={
            category === "installments"
              ? "Nome da compra"
              : category === "goals"
                ? "Nome da meta"
                : category === "investments"
                  ? "Nome do investimento"
                  : "Descrição"
          }
          className="col-span-2"
        >
          <input name="name" required defaultValue={item.name} placeholder="Ex.: Salário mensal" />
        </Field>
        <Field
          label={
            category === "goals"
              ? "Valor já economizado (R$)"
              : category === "investments"
                ? "Valor atual (R$)"
                : category === "installments"
                  ? "Valor da parcela (R$)"
                  : "Valor (R$)"
          }
        >
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            defaultValue={item.amount || ""}
            placeholder="0,00"
          />
        </Field>
        <Field label={category === "fixed" ? "Vencimento" : "Data"}>
          <input name="date" type="date" required defaultValue={item.date} />
        </Field>
        <Field
          label={
            category === "investments"
              ? "Tipo de investimento"
              : category === "income"
                ? "Fonte da renda"
                : "Categoria"
          }
        >
          <input name="type" defaultValue={item.type} placeholder="Ex.: Moradia" />
        </Field>
        {(category === "fixed" || category === "variable" || category === "installments") && (
          <Field label="Forma de pagamento">
            <select name="paymentMethod" defaultValue={item.paymentMethod}>
              <option value="">Selecione</option>
              <option>PIX</option>
              <option>Cartão</option>
              <option>Boleto</option>
              <option>Débito automático</option>
              <option>Dinheiro</option>
            </select>
          </Field>
        )}
        {category === "fixed" && (
          <>
            <Field label="Recorrência">
              <select name="recurrence" defaultValue={item.recurrence || "Mensal"}>
                <option>Mensal</option>
                <option>Semanal</option>
                <option>Anual</option>
              </select>
            </Field>
            <Field label="Status">
              <select name="status" defaultValue={item.status}>
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
              </select>
            </Field>
          </>
        )}
        {category === "installments" && (
          <>
            <Field label="Valor total da compra">
              <input
                name="totalValue"
                type="number"
                step="0.01"
                defaultValue={item.totalValue || ""}
              />
            </Field>
            <Field label="Número de parcelas">
              <input
                name="installmentCount"
                type="number"
                min="1"
                defaultValue={item.installmentCount || 1}
              />
            </Field>
            <Field label="Parcelas já pagas">
              <input
                name="paidInstallments"
                type="number"
                min="0"
                defaultValue={item.paidInstallments || 0}
              />
            </Field>
            <Field label="Primeiro vencimento">
              <input name="firstDueDate" type="date" defaultValue={item.firstDueDate} />
            </Field>
            <Field label="Status da parcela atual">
              <select name="status" defaultValue={item.status}>
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
              </select>
            </Field>
          </>
        )}
        {category === "investments" && (
          <>
            <Field label="Valor inicial (R$)">
              <input
                name="initialAmount"
                type="number"
                step="0.01"
                defaultValue={item.initialAmount || ""}
              />
            </Field>
            <Field label="Aportes no mês (R$)">
              <input
                name="contributions"
                type="number"
                step="0.01"
                defaultValue={item.contributions || ""}
              />
            </Field>
          </>
        )}
        {category === "goals" && (
          <>
            <Field label="Valor alvo (R$)">
              <input
                name="target"
                type="number"
                min="0.01"
                step="0.01"
                required
                defaultValue={item.target || ""}
              />
            </Field>
            <Field label="Data alvo">
              <input name="targetDate" type="date" defaultValue={item.targetDate} />
            </Field>
          </>
        )}
        <Field label="Observações (opcional)" className="col-span-2">
          <textarea
            name="notes"
            rows={2}
            defaultValue={item.notes}
            placeholder="Adicione informações importantes..."
          />
        </Field>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit">Salvar registro</button>
      </div>
    </form>
  );
}

function InstallmentList({ item, onMarkPaid }: { item: FinanceItem; onMarkPaid: () => void }) {
  const count = item.installmentCount ?? 1;
  const paid = item.paidInstallments ?? 0;
  return (
    <div className="installment-list">
      {Array.from({ length: count }, (_, index) => {
        const isPaid = index < paid;
        const first = new Date(`${item.firstDueDate || item.date}T12:00:00`);
        first.setMonth(first.getMonth() + index);
        return (
          <div key={index}>
            <span>
              Parcela {String(index + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
            </span>
            <span>
              {money(item.amount)} · {first.toLocaleDateString("pt-BR")}
            </span>
            <strong className={isPaid ? "paid" : ""}>{isPaid ? "Pago" : "Pendente"}</strong>
          </div>
        );
      })}
      {paid < count && (
        <button onClick={onMarkPaid}>
          <Icon name="check" size={13} /> Pagar próxima parcela
        </button>
      )}
    </div>
  );
}

export default App;
