import { useEffect, useState } from "react";
import {
  Wallet,
  Stethoscope,
  Activity,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCashTransactions, getCashTransactionSummary } from "../../services/cashTransactions.service";
import AdminDataPage from "../../components/table/AdminDataPage";


const IncomePage = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
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

  const loadPayments = async (page = pagination.page, currentFilters = filters) => {
    try {
      setLoading(true);

      const params = {type: "income", page,limit: pagination.limit,};

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


      setPayments(response.transactions || []);

      setPagination((prev) => ({
        ...prev,
        page: response.pagination?.page || page,
        total: response.pagination?.total || 0,
      }));
    } catch (error) {
      console.error(
        "Failed to load payments:",
        error
      );

      setPayments([]);
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
        type: "income",
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

      const response =
        await getCashTransactionSummary(params);

      setSummary(response.data || null);
    } catch (error) {
      console.error(
        "Failed to load payments summary:",
        error
      );

      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
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

    loadPayments(1, filters);
    loadSummary(filters);
  };

  const handlePageChange = (page) => {
    loadPayments(page, filters);
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
      case "visit_payment":
        return "Visit Payment";

      case "operation_payment":
        return "Operation Payment";

      case "sale_payment":
        return "Sale Payment";

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
        <span className="badge bg-primary">
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
      label: "Received By",
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
      label: "Payment Type",
      type: "select",
      value: filters.source,
      options: [
        {
          value: "",
          label: "All Payments",
        },
        {
          value: "visit_payment",
          label: "Visit Payment",
        },
        {
          value: "operation_payment",
          label: "Operation Payment",
        },
        {
          value: "sale_payment",
          label: "Sale Payment",
        },
      ],
    },
  ];

  const summaryCards = summary ? [
        {
          key: "total",
          label: "Total Payments",
          value: formatMoney(
            summary.totalIncome
          ),
          icon: <Wallet size={20} />,
        },

        {
          key: "visits",
          label: "Visit Payments",
          value: formatMoney(
            summary.incomeSources
              ?.visitPayments
          ),
          icon: <Stethoscope size={20} />,
        },

        {
          key: "operations",
          label: "Operation Payments",
          value: formatMoney(
            summary.incomeSources
              ?.operationPayments
          ),
          icon: <Activity size={20} />,
        },

        {
          key: "sales",
          label: "Sale Payments",
          value: formatMoney(
            summary.incomeSources
              ?.salePayments
          ),
          icon: <ShoppingCart size={20} />,
        },
      ]
    : [];

  return (
    <AdminDataPage
      title="Payments"
      subtitle="View all hospital income and payments"
      type=""
      addLink={null}
      loading={loading || summaryLoading}
      data={payments}
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
      emptyMessage="No payments found"
    />
  );
};

export default IncomePage;