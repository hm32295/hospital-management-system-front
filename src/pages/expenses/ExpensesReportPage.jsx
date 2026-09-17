import { useEffect, useState } from "react";
import {
  Wallet,
  UserRound,
  Receipt,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminDataPage from "../../components/table/AdminDataPage";
import { getCashTransactions, getCashTransactionSummary } from "../../services/cashTransactions.service";

const ExpensesReportPage = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] =
    useState(false);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    source: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const loadExpenses = async (
    page = pagination.page,
    currentFilters = filters
  ) => {
    try {
      setLoading(true);

      const params = {
        type: "expense",
        page,
        limit: pagination.limit,
      };

      if (currentFilters.fromDate) {
        params.fromDate = currentFilters.fromDate;
      }

      if (currentFilters.toDate) {
        params.toDate = currentFilters.toDate;
      }

      if (currentFilters.source) {
        params.source = currentFilters.source;
      }

        const response = await getCashTransactions(params); 
        console.log(response);
        
      setExpenses(response.transactions|| []);

      setPagination((prev) => ({
        ...prev,
        page: response.pagination?.page || page,
        total: response.pagination?.total || 0,
      }));
    } catch (error) {
      console.error(
        "Failed to load expenses:",
        error
      );

      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async (
    currentFilters = filters
  ) => {
    try {
      setSummaryLoading(true);

      const params = {
        type: "expense",
      };

      if (currentFilters.fromDate) {
        params.fromDate = currentFilters.fromDate;
      }

      if (currentFilters.toDate) {
        params.toDate = currentFilters.toDate;
      }

      if (currentFilters.source) {
        params.source = currentFilters.source;
      }

      const response = await getCashTransactionSummary(params);

      setSummary(response.data || null);
    } catch (error) {
      console.error(
        "Failed to load expenses summary:",
        error
      );

      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    loadSummary();
  }, []);

  const handleFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleFiltering = () => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));

    loadExpenses(1, filters);
    loadSummary(filters);
  };

  const handlePageChange = (page) => {
    loadExpenses(page, filters);
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString(
      "en-EG"
    )} EGP`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-EG", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const getSourceLabel = (source) => {
    switch (source) {
      case "expense":
        return "General Expense";

      case "doctor_settlement":
        return "Doctor Settlement";

      case "refund":
        return "Refund";

      case "other":
        return "Other";

      default:
        return source || "-";
    }
  };

  const columns = [
    {
      key: "createdAt",
      label: "Date",
      render: (item) =>
        formatDate(item.createdAt),
    },

    {
      key: "source",
      label: "Type",
      render: (item) => (
        <span className="badge bg-danger">
          {getSourceLabel(item.source)}
        </span>
      ),
    },

    {
      key: "patient",
      label: "Patient",
      render: (item) =>
        item.patient?.name || "-",
    },

    {
      key: "doctor",
      label: "Doctor",
      render: (item) =>
        item.doctor?.name || "-",
    },

    {
      key: "operation",
      label: "Operation",
      render: (item) => {
        if (!item.operation) {
          return "-";
        }

        return (
          item.operation.operationName ||
          `Operation #${item.operation._id?.slice(
            -6
          )}`
        );
      },
    },

    {
      key: "amount",
      label: "Amount",
      render: (item) => (
        <strong>
          {formatMoney(item.amount)}
        </strong>
      ),
    },

    {
      key: "createdBy",
      label: "Paid By",
      render: (item) =>
        item.createdBy?.name || "-",
    },

    {
      key: "notes",
      label: "Notes",
      render: (item) =>
        item.notes || "-",
    },
  ];

  const filterConfig = [
    {
      name: "fromDate",
      label: "From Date",
      type: "date",
      value: filters.fromDate,
    },

    {
      name: "toDate",
      label: "To Date",
      type: "date",
      value: filters.toDate,
    },

    {
      name: "source",
      label: "Expense Type",
      type: "select",
      value: filters.source,
      options: [
        {
          value: "",
          label: "All Expenses",
        },
        {
          value: "expense",
          label: "General Expense",
        },
        {
          value: "doctor_settlement",
          label: "Doctor Settlement",
        },
        {
          value: "refund",
          label: "Refund",
        },
        {
          value: "other",
          label: "Other",
        },
      ],
    },
  ];

  const summaryCards = summary? [
        {
          key: "total",
          label: "Total Expenses",
          value: formatMoney(
            summary.totalExpense
          ),
          icon: <Wallet size={20} />,
        },

        {
          key: "doctor",
          label: "Doctor Settlements",
          value: formatMoney(
            summary.expenseSources
              ?.doctorSettlements
          ),
          icon: <UserRound size={20} />,
        },

        {
          key: "general",
          label: "General Expenses",
          value: formatMoney(
            summary.expenseSources?.expenses
          ),
          icon: <Receipt size={20} />,
        },

        {
          key: "refunds",
          label: "Refunds",
          value: formatMoney(
            summary.expenseSources?.refunds
          ),
          icon: <RotateCcw size={20} />,
        },
      ]
    : [];

  return (
    <AdminDataPage
      title="Expenses"
      subtitle="View all hospital expenses"
      type=""
      addLink={null}
      loading={loading || summaryLoading}
      data={expenses}
      columns={columns}
      filters={filterConfig}
      onFilter={handleFilter}
      filtering={handleFiltering}
      pagination={pagination}
      onPageChange={handlePageChange}
      summary={{
        cards: summaryCards,
      }}
      actions={[
        {
          type: "show",
          label: "View Details",
          onClick: (item) =>
            navigate(
              `/cash-transactions/${item._id}`
            ),
        },
      ]}
      emptyMessage="No expenses found"
    />
  );
};

export default ExpensesReportPage;