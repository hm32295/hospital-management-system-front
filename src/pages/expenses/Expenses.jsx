
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAllExpenses } from "../../services/expense.service";
import AdminDataPage from "../../components/table/AdminDataPage";

import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Expenses = () => {
  const { t, i18n } = useTranslation();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] =
    useState({
      page: 1,
      total: 0,
      limit: 10,
    });

  const [filtersState, setFiltersState] =
    useState({});

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const response =
        await getAllExpenses({
          page: pagination.page,
          limit: pagination.limit,
          ...filtersState,
        });

      setExpenses(
        response.expenses || []
      );

      setPagination((prev) => ({
        ...prev,
        ...(response.pagination || {}),
      }));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("expenses.failedLoad")
        )
      );

      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [pagination.page]);

  const handleFilter = (name, value) => {
    setFiltersState((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const filters = [
    {
      name: "status",
      label: t("expenses.status"),
      type: "select",
      value: filtersState.status,
      options: [
        {
          value: undefined,
          label: t("expenses.all"),
        },
        {
          value: "completed",
          label: t(
            "expenses.statuses.completed"
          ),
        },
        {
          value: "cancelled",
          label: t(
            "expenses.statuses.cancelled"
          ),
        },
      ],
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "category",
      label: t("expenses.category"),
      type: "select",
      value: filtersState.category,
      options: [
        {
          value: undefined,
          label: t("expenses.all"),
        },
        {
          value: "transportation",
          label: t(
            "expenses.categories.transportation"
          ),
        },
        {
          value: "salary",
          label: t(
            "expenses.categories.salary"
          ),
        },
        {
          value: "utilities",
          label: t(
            "expenses.categories.utilities"
          ),
        },
        {
          value: "maintenance",
          label: t(
            "expenses.categories.maintenance"
          ),
        },
        {
          value: "supplies",
          label: t(
            "expenses.categories.supplies"
          ),
        },
        {
          value: "other",
          label: t(
            "expenses.categories.other"
          ),
        },
      ],
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "fromDate",
      label: t("expenses.fromDate"),
      type: "date",
      value: filtersState.fromDate,
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "toDate",
      label: t("expenses.toDate"),
      type: "date",
      value: filtersState.toDate,
      col: "col-12 col-md-6 col-lg-3",
    },
  ];

  const formatMoney = (value) => {
    return `${Number(
      value || 0
    ).toLocaleString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-EG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )} ${t("common.egp")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-GB"
    );
  };

  const columns = [
    {
      key: "createdAt",
      label: t("expenses.date"),
      render: (expense) =>
        formatDate(expense.createdAt),
    },
    {
      key: "category",
      label: t("expenses.category"),
      render: (expense) => (
        <span className="text-capitalize">
          {expense.category
            ? t(
                `expenses.categories.${expense.category}`,
                {
                  defaultValue:
                    expense.category,
                }
              )
            : "-"}
        </span>
      ),
    },
    {
      key: "description",
      label: t("expenses.description"),
      render: (expense) =>
        expense.description || "-",
    },
    {
      key: "amount",
      label: t("expenses.amount"),
      render: (expense) => (
        <strong>
          {formatMoney(expense.amount)}
        </strong>
      ),
    },
    {
      key: "createdBy",
      label: t("expenses.createdBy"),
      render: (expense) =>
        expense.createdBy?.name || "-",
    },
    {
      key: "status",
      label: t("expenses.status"),
      render: (expense) => (
        <span
          className={`badge ${
            expense.status === "completed"
              ? "text-bg-success"
              : "text-bg-secondary"
          }`}
        >
          {expense.status
            ? t(
                `expenses.statuses.${expense.status}`,
                {
                  defaultValue:
                    expense.status,
                }
              )
            : "-"}
        </span>
      ),
    },
  ];

  return (
    <AdminDataPage
      title={t("expenses.title")}
      subtitle={t("expenses.subtitle")}
      type="Add"
      addLink="/expenses/add"
      data={expenses}
      columns={columns}
      loading={loading}
      filters={filters}
      onFilter={handleFilter}
      filtering={fetchExpenses}
      pagination={pagination}
      onPageChange={(page) =>
        setPagination((prev) => ({
          ...prev,
          page,
        }))
      }
      emptyMessage={t(
        "expenses.noExpensesFound"
      )}
    />
  );
};

export default Expenses;