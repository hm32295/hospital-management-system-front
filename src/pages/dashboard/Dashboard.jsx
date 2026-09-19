import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  HeartPulse,
  Package,
  Pill,
  RefreshCw,
  ShoppingCart,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getDashboard } from "../../services/dashboard.service";

import "./dashboard.css";

const CHART_COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#14b8a6",
];

const getCurrentMonth = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
};

const formatNumber = (value = 0) => {
  return new Intl.NumberFormat("en-US").format(
    Number(value) || 0
  );
};

const formatMoney = (value = 0) => {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)} EGP`;
};

const formatCompactMoney = (value = 0) => {
  const number = Number(value) || 0;

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return formatNumber(number);
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDaysRemaining = (date) => {
  if (!date) return null;

  const today = new Date();
  const expiry = new Date(date);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil(
    (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
};

const getMonthLabel = (month) => {
  if (!month) return "";

  const [year, monthNumber] = month.split("-");

  return new Date(
    Number(year),
    Number(monthNumber) - 1
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const truncateText = (text, length = 18) => {
  if (!text) return "-";

  if (text.length <= length) {
    return text;
  }

  return `${text.substring(0, length)}...`;
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
}) => {
  return (
    <div className={`dashboard-stat-card stat-${color}`}>
      <div className="dashboard-stat-card-top">
        <div className="dashboard-stat-icon">
          <Icon size={21} strokeWidth={2.2} />
        </div>

        <div className="dashboard-stat-decoration" />
      </div>

      <div className="dashboard-stat-content">
        <span className="dashboard-stat-title">
          {title}
        </span>

        <strong className="dashboard-stat-value">
          {value}
        </strong>

        {subtitle && (
          <span className="dashboard-stat-subtitle">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

const SectionCard = ({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
  action,
}) => {
  return (
    <section
      className={`dashboard-card ${className}`}
    >
      <div className="dashboard-card-header">
        <div className="dashboard-card-heading">
          {Icon && (
            <div className="dashboard-section-icon">
              <Icon size={19} strokeWidth={2.2} />
            </div>
          )}

          <div>
            <h3>{title}</h3>

            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>

        {action && (
          <div className="dashboard-card-action">
            {action}
          </div>
        )}
      </div>

      <div className="dashboard-card-body">
        {children}
      </div>
    </section>
  );
};

const EmptyState = ({
  icon: Icon = Package,
  title = "No data",
  description = "There is no data available for this period.",
}) => {
  return (
    <div className="dashboard-empty">
      <div className="dashboard-empty-icon">
        <Icon size={25} />
      </div>

      <h4>{title}</h4>

      <p>{description}</p>
    </div>
  );
};

const ChartTooltip = ({
  active,
  payload,
  label,
  money = false,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="dashboard-tooltip">
      {label && <strong>{label}</strong>}

      {payload.map((item, index) => (
        <div
          className="dashboard-tooltip-row"
          key={index}
        >
          <span>
            <i
              style={{
                backgroundColor: item.color,
              }}
            />

            {item.name}
          </span>

          <strong>
            {money
              ? formatMoney(item.value)
              : formatNumber(item.value)}
          </strong>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [month, setMonth] = useState(
    getCurrentMonth()
  );

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchDashboard = async (
    selectedMonth = month
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getDashboard(selectedMonth);

      setDashboard(response);
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(month);
  }, [month]);

  const overview =
    dashboard?.overview || {};

  const sales =
    dashboard?.sales || {};

  const payments =
    dashboard?.payments || {};

  const visits =
    dashboard?.visits || {};

  const operations =
    dashboard?.operations || {};

  const expiryAlerts =
    dashboard?.expiryAlerts || {};

  const patientActivity =
    dashboard?.patientActivity || {};

  const monthLabel = useMemo(
    () => getMonthLabel(month),
    [month]
  );

  const salesChartData = useMemo(() => {
    return (
      dashboard?.sales?.daily?.map(
        (item) => ({
          date: new Date(
            `${item.date}T00:00:00`
          ).toLocaleDateString(
            "en-US",
            {
              day: "2-digit",
              month: "short",
            }
          ),
          amount:
            Number(item.amount) || 0,
          count:
            Number(item.count) || 0,
        })
      ) || []
    );
  }, [dashboard]);

  const topSellingData = useMemo(() => {
    return (
      dashboard?.topSellingMedicines
        ?.slice(0, 8)
        ?.map((item) => ({
          name:
            item?.medicine?.name ||
            "Unknown medicine",
          shortName: truncateText(
            item?.medicine?.name ||
              "Unknown",
            18
          ),
          quantity:
            Number(item.quantity) || 0,
          revenue:
            Number(item.revenue) || 0,
        })) || []
    );
  }, [dashboard]);

  const paymentData = useMemo(() => {
    return [
      {
        name: "Sales",
        value:
          Number(payments.sales) || 0,
      },
      {
        name: "Visits",
        value:
          Number(payments.visits) || 0,
      },
      {
        name: "Operations",
        value:
          Number(payments.operations) || 0,
      },
    ].filter(
      (item) => item.value > 0
    );
  }, [payments]);

  const visitData = useMemo(() => {
    return [
      {
        name: "First",
        fullName: "First Visits",
        value:
          Number(visits.first) || 0,
      },
      {
        name: "Follow-up",
        fullName: "Follow-up",
        value:
          Number(visits.followUp) || 0,
      },
      {
        name: "Completed",
        fullName: "Completed",
        value:
          Number(visits.completed) || 0,
      },
      {
        name: "Waiting",
        fullName: "Waiting",
        value:
          Number(visits.waiting) || 0,
      },
      {
        name: "In Consultation",
        fullName: "In Consultation",
        value:
          Number(visits.inConsultation) || 0,
      },
    ].filter(
      (item) => item.value > 0
    );
  }, [visits]);

  const expiryData = useMemo(() => {
    const expired =
      expiryAlerts.expired || [];

    const within30 =
      expiryAlerts.within30Days || [];

    const all = [
      ...expired.map((item) => ({
        ...item,
        alertType: "expired",
      })),
      ...within30.map((item) => ({
        ...item,
        alertType: "soon",
      })),
    ];

    const unique = new Map();

    all.forEach((item) => {
      if (item?._id) {
        unique.set(item._id, item);
      }
    });

    return Array.from(
      unique.values()
    )
      .sort((a, b) => {
        return (
          new Date(a.expiryDate) -
          new Date(b.expiryDate)
        );
      })
      .slice(0, 10);
  }, [expiryAlerts]);

  const paymentTotal =
    Number(payments.total) || 0;

  const operationCompletion =
    operations.total
      ? Math.round(
          (Number(
            operations.completed
          ) /
            Number(operations.total)) *
            100
        )
      : 0;

  const visitCompletion =
    visits.total
      ? Math.round(
          (Number(visits.completed) /
            Number(visits.total)) *
            100
        )
      : 0;

  if (loading && !dashboard) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loading-icon">
            <RefreshCw
              size={30}
              className="dashboard-spin"
            />
          </div>

          <h3>
            Loading Dashboard
          </h3>

          <p>
            Preparing hospital statistics...
          </p>
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="dashboard-error-icon">
            <AlertTriangle size={30} />
          </div>

          <h3>
            Unable to load dashboard
          </h3>

          <p>{error}</p>

          <button
            type="button"
            className="dashboard-primary-btn"
            onClick={() =>
              fetchDashboard(month)
            }
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`dashboard-page ${
        loading
          ? "dashboard-refreshing"
          : ""
      }`}
    >
      {loading && dashboard && (
        <div className="dashboard-loading-overlay">
          <div className="dashboard-loading-box">
            <div className="dashboard-loading-icon">
              <RefreshCw
                size={28}
                className="dashboard-spin"
              />
            </div>

            <h3>
              Updating Dashboard
            </h3>

            <p>
              Loading data for{" "}
              <strong>
                {monthLabel}
              </strong>
            </p>
          </div>
        </div>
      )}

      <div className="dashboard-container">

        {/* HEADER */}

        <header className="dashboard-header">
          <div className="dashboard-header-info">
            <span className="dashboard-eyebrow">
              Hospital Management System
            </span>

            <h1>
              Hospital Dashboard
            </h1>

            <p>
              A clear overview of hospital,
              pharmacy and patient activity.
            </p>
          </div>

          <div className="dashboard-header-controls">
            <div className="dashboard-month-control">
              <CalendarDays size={18} />

              <div>
                <span>
                  Reporting Month
                </span>

                <input
                  type="month"
                  value={month}
                  disabled={loading}
                  onChange={(e) =>
                    setMonth(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <button
              type="button"
              className="dashboard-refresh-btn"
              onClick={() =>
                fetchDashboard(month)
              }
              disabled={loading}
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "dashboard-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </header>

        {/* PERIOD */}

        <div className="dashboard-period">
          <div className="dashboard-period-left">
            <div className="dashboard-period-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <span>
                Selected period
              </span>

              <strong>
                {monthLabel}
              </strong>
            </div>
          </div>

          <div className="dashboard-live-status">
            <span />
            Dashboard Active
          </div>
        </div>

        {error && (
          <div className="dashboard-inline-error">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* KPI */}

        <div className="dashboard-stat-grid">
          <StatCard
            title="Total Sales"
            value={formatMoney(
              overview.sales
            )}
            subtitle={`${formatNumber(
              overview.salesCount
            )} completed sales`}
            icon={CircleDollarSign}
            color="blue"
          />

          <StatCard
            title="Collected Payments"
            value={formatMoney(
              paymentTotal
            )}
            subtitle="Actual completed payments"
            icon={WalletCards}
            color="green"
          />

          <StatCard
            title="Patients"
            value={formatNumber(
              overview.patients
            )}
            subtitle={`${formatNumber(
              overview.newPatients
            )} new this month`}
            icon={Users}
            color="purple"
          />

          <StatCard
            title="Visits"
            value={formatNumber(
              overview.visits
            )}
            subtitle={`${formatNumber(
              visits.completed
            )} completed`}
            icon={Stethoscope}
            color="orange"
          />

          <StatCard
            title="Operations"
            value={formatNumber(
              overview.operations
            )}
            subtitle={formatMoney(
              operations.totalAmount
            )}
            icon={Activity}
            color="red"
          />

          <StatCard
            title="Medicines Sold"
            value={formatNumber(
              overview.medicinesSold
            )}
            subtitle={`${formatNumber(
              overview.medicines
            )} active medicines`}
            icon={Pill}
            color="cyan"
          />

          <StatCard
            title="Low Stock"
            value={formatNumber(
              overview.lowStock
            )}
            subtitle="Batches need attention"
            icon={Package}
            color="yellow"
          />

          <StatCard
            title="Expiring Soon"
            value={formatNumber(
              overview.expiringSoon
            )}
            subtitle="Within next 30 days"
            icon={AlertTriangle}
            color="pink"
          />
        </div>

        {/* SALES */}

        <div className="dashboard-main-grid">
          <SectionCard
            title="Sales Performance"
            subtitle={`Daily sales during ${monthLabel}`}
            icon={TrendingUp}
            className="dashboard-large-card"
            action={
              <div className="dashboard-total-pill">
                <span>Total</span>

                <strong>
                  {formatMoney(
                    sales.total
                  )}
                </strong>
              </div>
            }
          >
            {salesChartData.length > 0 ? (
              <div className="dashboard-chart dashboard-sales-chart">
                <ResponsiveContainer
                  width="100%"
                  height={350}
                >
                  <BarChart
                    data={
                      salesChartData
                    }
                    margin={{
                      top: 35,
                      right: 15,
                      left: 5,
                      bottom: 5,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="salesGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity={1}
                        />

                        <stop
                          offset="100%"
                          stopColor="#60a5fa"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#e8eef7"
                      strokeDasharray="4 5"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      tickFormatter={
                        formatCompactMoney
                      }
                    />

                    <Tooltip
                      content={
                        <ChartTooltip
                          money
                        />
                      }
                    />

                    <Bar
                      dataKey="amount"
                      name="Sales"
                      fill="url(#salesGradient)"
                      radius={[
                        8,
                        8,
                        2,
                        2,
                      ]}
                      maxBarSize={54}
                    >
                      <LabelList
                        dataKey="amount"
                        position="top"
                        formatter={
                          formatCompactMoney
                        }
                        style={{
                          fill: "#1d4ed8",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={TrendingDown}
                title="No sales yet"
                description={`No completed sales were recorded in ${monthLabel}.`}
              />
            )}

            <div className="dashboard-chart-footer">
              <div>
                <span>
                  Average Sale
                </span>

                <strong>
                  {formatMoney(
                    sales.averageSale
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Completed Sales
                </span>

                <strong>
                  {formatNumber(
                    sales.count
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Paid Sales
                </span>

                <strong>
                  {formatMoney(
                    overview.salesPaid
                  )}
                </strong>
              </div>
            </div>
          </SectionCard>

          {/* PAYMENTS */}

          <SectionCard
            title="Payment Distribution"
            subtitle="Collected payments by service"
            icon={WalletCards}
            className="dashboard-side-card"
          >
            {paymentData.length > 0 ? (
              <>
                <div className="dashboard-donut">
                  <ResponsiveContainer
                    width="100%"
                    height={275}
                  >
                    <PieChart>
                      <Pie
                        data={paymentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="48%"
                        innerRadius={65}
                        outerRadius={103}
                        paddingAngle={4}
                        stroke="#fff"
                        strokeWidth={4}
                        labelLine={false}
                        label={({
                          percent,
                        }) =>
                          `${Math.round(
                            percent * 100
                          )}%`
                        }
                      >
                        {paymentData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                CHART_COLORS[
                                  index
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <ChartTooltip
                            money
                          />
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="dashboard-donut-center">
                    <span>
                      Collected
                    </span>

                    <strong>
                      {formatCompactMoney(
                        paymentTotal
                      )}
                    </strong>

                    <small>
                      EGP
                    </small>
                  </div>
                </div>

                <div className="dashboard-payment-list">
                  {paymentData.map(
                    (item, index) => (
                      <div
                        className="dashboard-payment-item"
                        key={item.name}
                      >
                        <div>
                          <span
                            className="dashboard-color-dot"
                            style={{
                              backgroundColor:
                                CHART_COLORS[
                                  index
                                ],
                            }}
                          />

                          <span>
                            {item.name}
                          </span>
                        </div>

                        <strong>
                          {formatMoney(
                            item.value
                          )}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </>
            ) : (
              <EmptyState
                icon={WalletCards}
                title="No payments"
                description="No completed payments were recorded."
              />
            )}
          </SectionCard>
        </div>

        {/* MEDICINES + VISITS */}

        <div className="dashboard-main-grid">
          <SectionCard
            title="Top Selling Medicines"
            subtitle="Highest quantity sold during the selected month"
            icon={ShoppingCart}
            className="dashboard-large-card"
          >
            {topSellingData.length > 0 ? (
              <div className="dashboard-chart">
                <ResponsiveContainer
                  width="100%"
                  height={390}
                >
                  <BarChart
                    data={
                      topSellingData
                    }
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 55,
                      left: 10,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid
                      stroke="#e8eef7"
                      strokeDasharray="4 5"
                      horizontal={false}
                    />

                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                    />

                    <YAxis
                      type="category"
                      dataKey="shortName"
                      width={115}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#334155",
                        fontWeight: 600,
                      }}
                    />

                    <Tooltip
                      formatter={(value) =>
                        `${formatNumber(
                          value
                        )} units`
                      }
                      labelFormatter={(
                        label,
                        payload
                      ) =>
                        payload?.[0]
                          ?.payload
                          ?.name ||
                        label
                      }
                    />

                    <Bar
                      dataKey="quantity"
                      name="Sold"
                      radius={[
                        0,
                        8,
                        8,
                        0,
                      ]}
                      fill="#10b981"
                      maxBarSize={28}
                    >
                      <LabelList
                        dataKey="quantity"
                        position="right"
                        formatter={
                          formatNumber
                        }
                        style={{
                          fill: "#047857",
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={ShoppingCart}
                title="No medicine sales"
                description="There are no completed medicine sales for this month."
              />
            )}
          </SectionCard>

          <SectionCard
            title="Visit Overview"
            subtitle="Patient activity during the selected month"
            icon={HeartPulse}
            className="dashboard-side-card"
          >
            {visitData.length > 0 ? (
              <>
                <div className="dashboard-chart">
                  <ResponsiveContainer
                    width="100%"
                    height={325}
                  >
                    <BarChart
                      data={visitData}
                      margin={{
                        top: 35,
                        right: 5,
                        left: -20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        stroke="#e8eef7"
                        strokeDasharray="4 5"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: "#475569",
                          fontWeight: 600,
                        }}
                        interval={0}
                      />

                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: "#64748b",
                        }}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        name="Visits"
                        radius={[
                          8,
                          8,
                          2,
                          2,
                        ]}
                        maxBarSize={45}
                      >
                        {visitData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                CHART_COLORS[
                                  index
                                ]
                              }
                            />
                          )
                        )}

                        <LabelList
                          dataKey="value"
                          position="top"
                          formatter={
                            formatNumber
                          }
                          style={{
                            fill: "#334155",
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="dashboard-completion">
                  <div>
                    <span>
                      Completion Rate
                    </span>

                    <strong>
                      {visitCompletion}%
                    </strong>
                  </div>

                  <div className="dashboard-progress-track">
                    <div
                      style={{
                        width: `${visitCompletion}%`,
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                icon={Stethoscope}
                title="No visits"
                description="No visits were recorded for this month."
              />
            )}
          </SectionCard>
        </div>

        {/* THREE INFO CARDS */}

        <div className="dashboard-three-grid">

          {/* OPERATIONS */}

          <SectionCard
            title="Operations"
            subtitle="Hospital operation activity"
            icon={Activity}
          >
            <div className="dashboard-operation-summary">
              <div className="operation-big-number">
                <strong>
                  {formatNumber(
                    operations.total
                  )}
                </strong>

                <span>
                  Total Operations
                </span>
              </div>

              <div className="operation-rate">
                <strong>
                  {operationCompletion}%
                </strong>

                <span>
                  Completion
                </span>
              </div>
            </div>

            <div className="dashboard-mini-list">
              <div>
                <span>
                  <ArrowUpRight size={16} />
                  Completed
                </span>

                <strong>
                  {formatNumber(
                    operations.completed
                  )}
                </strong>
              </div>

              <div>
                <span>
                  <Clock3 size={16} />
                  Pending
                </span>

                <strong>
                  {formatNumber(
                    operations.pending
                  )}
                </strong>
              </div>

              <div>
                <span>
                  <ArrowDownRight size={16} />
                  Cancelled
                </span>

                <strong>
                  {formatNumber(
                    operations.cancelled
                  )}
                </strong>
              </div>
            </div>

            <div className="dashboard-money-summary">
              <div>
                <span>Total</span>

                <strong>
                  {formatMoney(
                    operations.totalAmount
                  )}
                </strong>
              </div>

              <div>
                <span>Paid</span>

                <strong className="money-green">
                  {formatMoney(
                    operations.paidAmount
                  )}
                </strong>
              </div>

              <div>
                <span>Remaining</span>

                <strong className="money-red">
                  {formatMoney(
                    operations.remainingAmount
                  )}
                </strong>
              </div>
            </div>
          </SectionCard>

          {/* PATIENT ACTIVITY */}

          <SectionCard
            title="Patient Activity"
            subtitle="New and returning patients"
            icon={Users}
          >
            <div className="patient-activity-grid">
              <div className="patient-activity-box new">
                <span>
                  New Patients
                </span>

                <strong>
                  {formatNumber(
                    patientActivity.newPatients
                  )}
                </strong>
              </div>

              <div className="patient-activity-box returning">
                <span>
                  Returning
                </span>

                <strong>
                  {formatNumber(
                    patientActivity.returningPatients
                  )}
                </strong>
              </div>
            </div>

            <div className="patient-total-box">
              <div>
                <span>
                  Total Visits
                </span>

                <strong>
                  {formatNumber(
                    visits.total
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Completed
                </span>

                <strong>
                  {formatNumber(
                    visits.completed
                  )}
                </strong>
              </div>
            </div>

            <div className="dashboard-progress-section">
              <div>
                <span>
                  Visit completion
                </span>

                <strong>
                  {visitCompletion}%
                </strong>
              </div>

              <div className="dashboard-progress-track">
                <div
                  style={{
                    width: `${visitCompletion}%`,
                  }}
                />
              </div>
            </div>
          </SectionCard>

          {/* INVENTORY */}

          <SectionCard
            title="Inventory Health"
            subtitle="Current pharmacy stock"
            icon={Package}
          >
            <div className="inventory-grid">
              <div className="inventory-box blue">
                <div>
                  <span />
                  <small>
                    Active Medicines
                  </small>
                </div>

                <strong>
                  {formatNumber(
                    overview.medicines
                  )}
                </strong>
              </div>

              <div className="inventory-box yellow">
                <div>
                  <span />
                  <small>
                    Low Stock
                  </small>
                </div>

                <strong>
                  {formatNumber(
                    overview.lowStock
                  )}
                </strong>
              </div>

              <div className="inventory-box red">
                <div>
                  <span />
                  <small>
                    Out of Stock
                  </small>
                </div>

                <strong>
                  {formatNumber(
                    overview.outOfStock
                  )}
                </strong>
              </div>

              <div className="inventory-box orange">
                <div>
                  <span />
                  <small>
                    Expiring Soon
                  </small>
                </div>

                <strong>
                  {formatNumber(
                    overview.expiringSoon
                  )}
                </strong>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* EXPIRY */}

        <SectionCard
          title="Medicine Expiry Alerts"
          subtitle="Batches that require attention"
          icon={AlertTriangle}
          className="dashboard-full-card"
          action={
            <div className="dashboard-alert-counter">
              <AlertTriangle size={15} />

              {formatNumber(
                overview.expiringSoon
              )}{" "}
              soon
            </div>
          }
        >
          {expiryData.length > 0 ? (
            <div className="dashboard-table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>
                      Medicine
                    </th>

                    <th>
                      Generic Name
                    </th>

                    <th>
                      Batch
                    </th>

                    <th>
                      Expiry Date
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {expiryData.map(
                    (item) => {
                      const days =
                        getDaysRemaining(
                          item.expiryDate
                        );

                      let status =
                        "normal";

                      if (
                        days <= 0
                      ) {
                        status =
                          "expired";
                      } else if (
                        days <= 7
                      ) {
                        status =
                          "critical";
                      } else if (
                        days <= 15
                      ) {
                        status =
                          "warning";
                      }

                      return (
                        <tr
                          key={
                            item._id
                          }
                        >
                          <td>
                            <div className="medicine-cell">
                              <div className="medicine-icon">
                                <Pill
                                  size={
                                    16
                                  }
                                />
                              </div>

                              <strong>
                                {item
                                  ?.medicine
                                  ?.name ||
                                  "-"}
                              </strong>
                            </div>
                          </td>

                          <td>
                            {item
                              ?.medicine
                              ?.genericName ||
                              "-"}
                          </td>

                          <td>
                            <span className="batch-code">
                              {item.batchNumber ||
                                "-"}
                            </span>
                          </td>

                          <td>
                            {formatDate(
                              item.expiryDate
                            )}
                          </td>

                          <td>
                            <strong>
                              {formatNumber(
                                item.quantity
                              )}
                            </strong>{" "}
                            units
                          </td>

                          <td>
                            <span
                              className={`expiry-status ${status}`}
                            >
                              {days <= 0
                                ? "Expired"
                                : `${days} days left`}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No urgent expiry alerts"
              description="There are no active batches requiring immediate attention."
            />
          )}
        </SectionCard>

        {/* PATIENTS + SLOW MOVING */}

        <div className="dashboard-main-grid">
          <SectionCard
            title="Most Frequent Patients"
            subtitle="Patients with the highest number of visits"
            icon={Users}
            className="dashboard-large-card"
          >
            {dashboard?.frequentPatients
              ?.length > 0 ? (
              <div className="dashboard-ranking-list">
                {dashboard.frequentPatients
                  .slice(0, 8)
                  .map(
                    (item, index) => (
                      <div
                        className="dashboard-ranking-item"
                        key={
                          item?.patient
                            ?._id ||
                          index
                        }
                      >
                        <div className="ranking-position">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="ranking-avatar">
                          {item?.patient?.name
                            ?.charAt(
                              0
                            )
                            ?.toUpperCase() ||
                            "P"}
                        </div>

                        <div className="ranking-info">
                          <strong>
                            {item
                              ?.patient
                              ?.name ||
                              "Unknown patient"}
                          </strong>

                          <span>
                            {item
                              ?.patient
                              ?.phone ||
                              "No phone number"}
                          </span>
                        </div>

                        <div className="ranking-value">
                          <strong>
                            {formatNumber(
                              item.visits
                            )}
                          </strong>

                          <span>
                            visits
                          </span>
                        </div>
                      </div>
                    )
                  )}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No patient activity"
                description="There are no patient visits for this period."
              />
            )}
          </SectionCard>

          <SectionCard
            title="Slow Moving Medicines"
            subtitle="Medicines with low or no sales"
            icon={TrendingDown}
          >
            {dashboard?.slowMovingMedicines
              ?.length > 0 ? (
              <div className="slow-medicine-list">
                {dashboard.slowMovingMedicines
                  .slice(0, 8)
                  .map((item) => (
                    <div
                      className="slow-medicine-item"
                      key={item._id}
                    >
                      <div className="slow-medicine-info">
                        <div className="slow-medicine-icon">
                          <Pill size={16} />
                        </div>

                        <div>
                          <strong>
                            {item.name}
                          </strong>

                          <span>
                            {item.genericName ||
                              "No generic name"}
                          </span>
                        </div>
                      </div>

                      <div className="slow-medicine-value">
                        <strong>
                          {formatNumber(
                            item.soldQuantity
                          )}
                        </strong>

                        <span>
                          sold
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <EmptyState
                icon={TrendingDown}
                title="No slow-moving medicines"
                description="No slow-moving medicine data is available."
              />
            )}
          </SectionCard>
        </div>

        {/* SPECIALTIES */}

        <SectionCard
          title="Most Active Specialties"
          subtitle="Specialties with the highest patient visits"
          icon={Stethoscope}
          className="dashboard-full-card"
        >
          {dashboard?.specialties
            ?.length > 0 ? (
            <div className="specialty-grid">
              {dashboard.specialties
                .slice(0, 8)
                .map(
                  (item, index) => (
                    <div
                      className="specialty-item"
                      key={
                        item
                          ?.specialty
                          ?._id ||
                        index
                      }
                    >
                      <div className="specialty-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="specialty-icon">
                        <Stethoscope
                          size={18}
                        />
                      </div>

                      <div className="specialty-info">
                        <strong>
                          {item
                            ?.specialty
                            ?.name ||
                            "Unknown specialty"}
                        </strong>

                        <span>
                          {formatNumber(
                            item.visits
                          )}{" "}
                          visits
                        </span>
                      </div>

                      <div className="specialty-value">
                        {formatNumber(
                          item.visits
                        )}
                      </div>
                    </div>
                  )
                )}
            </div>
          ) : (
            <EmptyState
              icon={Stethoscope}
              title="No specialty data"
              description="There is no specialty activity for this month."
            />
          )}
        </SectionCard>

        <div className="dashboard-footer-space" />
      </div>
    </div>
  );
};

export default Dashboard;