
import { useEffect, useState } from "react";
import {
  Wallet,
  Stethoscope,
  Activity,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  getCashTransactions,
  getCashTransactionSummary,
} from "../../services/cashTransactions.service";

import AdminDataPage from "../../components/table/AdminDataPage";

import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const IncomePage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
    });

  const loadPayments = async (
    page = pagination.page,
    currentFilters = filters
  ) => {
    try {
      setLoading(true);

      const params = {
        type: "income",
        page,
        limit: pagination.limit,
      };

      if (currentFilters.fromDate) {
        params.fromDate =
          currentFilters.fromDate;
      }

      if (currentFilters.toDate) {
        params.toDate =
          currentFilters.toDate;
      }

      if (currentFilters.source) {
        params.source =
          currentFilters.source;
      }

      const response =
        await getCashTransactions(params);

      setPayments(
        response.transactions || []
      );

      setPagination((prev) => ({
        ...prev,
        page:
          response.pagination?.page ||
          page,
        total:
          response.pagination?.total || 0,
      }));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("income.failedLoadPayments")
        )
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
        params.fromDate =
          currentFilters.fromDate;
      }

      if (currentFilters.toDate) {
        params.toDate =
          currentFilters.toDate;
      }

      if (currentFilters.source) {
        params.source =
          currentFilters.source;
      }

      const response =
        await getCashTransactionSummary(
          params
        );

      setSummary(response.data || null);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("income.failedLoadSummary")
        )
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
    return `${Number(
      value || 0
    ).toLocaleString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-EG"
    )} ${t("common.egp")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-EG",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  };

  const getSourceLabel = (source) => {
    switch (source) {
      case "visit_payment":
        return t(
          "income.sources.visitPayment"
        );

      case "operation_payment":
        return t(
          "income.sources.operationPayment"
        );

      case "sale_payment":
        return t(
          "income.sources.salePayment"
        );

      default:
        return source || "-";
    }
  };

  const columns = [
    {
      key: "createdAt",
      label: t("income.date"),
      render: (item) =>
        formatDate(item.createdAt),
    },
    {
      key: "source",
      label: t("income.type"),
      render: (item) => (
        <span className="badge bg-primary">
          {getSourceLabel(item.source)}
        </span>
      ),
    },
    {
      key: "patient",
      label: t("income.patient"),
      render: (item) =>
        item.patient?.name || "-",
    },
    {
      key: "amount",
      label: t("income.amount"),
      render: (item) => (
        <strong>
          {formatMoney(item.amount)}
        </strong>
      ),
    },
    {
      key: "createdBy",
      label: t("income.receivedBy"),
      render: (item) =>
        item.createdBy?.name || "-",
    },
    {
      key: "notes",
      label: t("income.notes"),
      render: (item) =>
        item.notes || "-",
    },
  ];

  const filterConfig = [
    {
      name: "fromDate",
      label: t("income.fromDate"),
      type: "date",
      value: filters.fromDate,
    },
    {
      name: "toDate",
      label: t("income.toDate"),
      type: "date",
      value: filters.toDate,
    },
    {
      name: "source",
      label: t("income.paymentType"),
      type: "select",
      value: filters.source,
      options: [
        {
          value: "",
          label: t("income.allPayments"),
        },
        {
          value: "visit_payment",
          label: t(
            "income.sources.visitPayment"
          ),
        },
        {
          value: "operation_payment",
          label: t(
            "income.sources.operationPayment"
          ),
        },
        {
          value: "sale_payment",
          label: t(
            "income.sources.salePayment"
          ),
        },
      ],
    },
  ];

  const summaryCards = summary
    ? [
        {
          key: "total",
          label: t("income.totalPayments"),
          value: formatMoney(
            summary.totalIncome
          ),
          icon: <Wallet size={20} />,
        },
        {
          key: "visits",
          label: t(
            "income.visitPayments"
          ),
          value: formatMoney(
            summary.incomeSources
              ?.visitPayments
          ),
          icon: (
            <Stethoscope size={20} />
          ),
        },
        {
          key: "operations",
          label: t(
            "income.operationPayments"
          ),
          value: formatMoney(
            summary.incomeSources
              ?.operationPayments
          ),
          icon: <Activity size={20} />,
        },
        {
          key: "sales",
          label: t("income.salePayments"),
          value: formatMoney(
            summary.incomeSources
              ?.salePayments
          ),
          icon: (
            <ShoppingCart size={20} />
          ),
        },
      ]
    : [];

  return (
    <AdminDataPage
      title={t("income.title")}
      subtitle={t("income.subtitle")}
      type=""
      addLink={null}
      loading={
        loading || summaryLoading
      }
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
          label: t("income.viewDetails"),
          onClick: (item) =>
            navigate(
              `/cash-transactions/${item._id}`
            ),
        },
      ]}
      emptyMessage={t(
        "income.noPaymentsFound"
      )}
    />
  );
};

export default IncomePage;