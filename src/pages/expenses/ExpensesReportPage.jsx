
import { useEffect, useState } from "react";
import {
  Wallet,
  UserRound,
  Receipt,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AdminDataPage from "../../components/table/AdminDataPage";

import {
  getCashTransactions,
  getCashTransactionSummary,
} from "../../services/cashTransactions.service";

import {
  showError,
} from "../../services/toast.service";

import { getApiErrorMessage } from "../../services/apiError";

const ExpensesReportPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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

      setExpenses(
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
          t("expensesReport.failedLoadExpenses")
        )
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
          t(
            "expensesReport.failedLoadSummary"
          )
        )
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
      case "expense":
        return t(
          "expensesReport.sources.expense"
        );

      case "doctor_settlement":
        return t(
          "expensesReport.sources.doctorSettlement"
        );

      case "refund":
        return t(
          "expensesReport.sources.refund"
        );

      case "other":
        return t(
          "expensesReport.sources.other"
        );

      default:
        return source || "-";
    }
  };

  const columns = [
    {
      key: "createdAt",
      label: t("expensesReport.date"),
      render: (item) =>
        formatDate(item.createdAt),
    },

    {
      key: "source",
      label: t("expensesReport.type"),
      render: (item) => (
        <span className="badge bg-danger">
          {getSourceLabel(item.source)}
        </span>
      ),
    },

    {
      key: "patient",
      label: t("expensesReport.patient"),
      render: (item) =>
        item.patient?.name || "-",
    },

    {
      key: "doctor",
      label: t("expensesReport.doctor"),
      render: (item) =>
        item.doctor?.name || "-",
    },

    {
      key: "operation",
      label: t("expensesReport.operation"),
      render: (item) => {
        if (!item.operation) {
          return "-";
        }

        return (
          item.operation.operationName ||
          t("expensesReport.operationNumber", {
            id: item.operation._id?.slice(-6),
          })
        );
      },
    },

    {
      key: "amount",
      label: t("expensesReport.amount"),
      render: (item) => (
        <strong>
          {formatMoney(item.amount)}
        </strong>
      ),
    },

    {
      key: "createdBy",
      label: t("expensesReport.paidBy"),
      render: (item) =>
        item.createdBy?.name || "-",
    },

    {
      key: "notes",
      label: t("expensesReport.notes"),
      render: (item) =>
        item.notes || "-",
    },
  ];

  const filterConfig = [
    {
      name: "fromDate",
      label: t("expensesReport.fromDate"),
      type: "date",
      value: filters.fromDate,
    },

    {
      name: "toDate",
      label: t("expensesReport.toDate"),
      type: "date",
      value: filters.toDate,
    },

    {
      name: "source",
      label: t(
        "expensesReport.expenseType"
      ),
      type: "select",
      value: filters.source,
      options: [
        {
          value: "",
          label: t(
            "expensesReport.allExpenses"
          ),
        },
        {
          value: "expense",
          label: t(
            "expensesReport.sources.expense"
          ),
        },
        {
          value: "doctor_settlement",
          label: t(
            "expensesReport.sources.doctorSettlement"
          ),
        },
        {
          value: "refund",
          label: t(
            "expensesReport.sources.refund"
          ),
        },
        {
          value: "other",
          label: t(
            "expensesReport.sources.other"
          ),
        },
      ],
    },
  ];

  const summaryCards = summary
    ? [
        {
          key: "total",
          label: t(
            "expensesReport.totalExpenses"
          ),
          value: formatMoney(
            summary.totalExpense
          ),
          icon: <Wallet size={20} />,
        },

        {
          key: "doctor",
          label: t(
            "expensesReport.doctorSettlements"
          ),
          value: formatMoney(
            summary.expenseSources
              ?.doctorSettlements
          ),
          icon: <UserRound size={20} />,
        },

        {
          key: "general",
          label: t(
            "expensesReport.generalExpenses"
          ),
          value: formatMoney(
            summary.expenseSources?.expenses
          ),
          icon: <Receipt size={20} />,
        },

        {
          key: "refunds",
          label: t(
            "expensesReport.refunds"
          ),
          value: formatMoney(
            summary.expenseSources?.refunds
          ),
          icon: <RotateCcw size={20} />,
        },
      ]
    : [];

  return (
    <AdminDataPage
      title={t("expensesReport.title")}
      subtitle={t(
        "expensesReport.subtitle"
      )}
      type=""
      addLink={null}
      loading={
        loading || summaryLoading
      }
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
          label: t(
            "expensesReport.viewDetails"
          ),
          onClick: (item) =>
            navigate(
              `/cash-transactions/${item._id}`
            ),
        },
      ]}
      emptyMessage={t(
        "expensesReport.noExpensesFound"
      )}
    />
  );
};

export default ExpensesReportPage;