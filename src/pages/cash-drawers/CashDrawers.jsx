
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllCashDrawers } from "../../services/cashDrawer.service";
import AdminDataPage from "../../components/table/AdminDataPage";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const CashDrawers = () => {
  const { t, i18n } = useTranslation();

  const [drawers, setDrawers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 10,
  });

  const fetchDrawers = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await getAllCashDrawers({
        page: pagination.page,
        limit: pagination.limit,
      });

      setDrawers(response.cashDrawers || []);

      setPagination((prev) => ({
        ...prev,
        ...(response.pagination || {}),
      }));
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        t("cashDrawers.loadFailed")
      );

      setServerError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrawers();
  }, [pagination.page, pagination.limit]);

  const formatMoney = (value) =>
    `${Number(value || 0).toFixed(2)} ${t("common.egp")}`;

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString(
          i18n.language === "ar"
            ? "ar-EG"
            : "en-GB"
        )
      : "-";

  const columns = [
    {
      key: "openedBy",
      label: t("cashDrawers.openedBy"),
      render: (drawer) =>
        drawer.openedBy?.name || "-",
    },
    {
      key: "openingBalance",
      label: t("cashDrawers.opening"),
      render: (drawer) =>
        formatMoney(drawer.openingBalance),
    },
    {
      key: "expectedCash",
      label: t("cashDrawers.expected"),
      render: (drawer) =>
        formatMoney(drawer.expectedCash),
    },
    {
      key: "actualCash",
      label: t("cashDrawers.actual"),
      render: (drawer) =>
        drawer.status === "closed"
          ? formatMoney(drawer.actualCash)
          : "-",
    },
    {
      key: "difference",
      label: t("cashDrawers.difference"),
      render: (drawer) =>
        drawer.status === "closed"
          ? formatMoney(drawer.difference)
          : "-",
    },
    {
      key: "status",
      label: t("cashDrawers.status"),
      render: (drawer) => (
        <span
          className={`badge ${
            drawer.status === "open"
              ? "text-bg-success"
              : "text-bg-secondary"
          }`}
        >
          {drawer.status === "open"
            ? t("cashDrawers.statuses.open")
            : t("cashDrawers.statuses.closed")}
        </span>
      ),
    },
    {
      key: "openedAt",
      label: t("cashDrawers.openedAt"),
      render: (drawer) =>
        formatDate(drawer.openedAt),
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("cashDrawers.viewDrawer"),
      link: (drawer) =>
        `/cash-drawers/${drawer._id}`,
    },
  ];

  return (
    <AdminDataPage
      title={t("cashDrawers.title")}
      subtitle={t("cashDrawers.subtitle")}
      type="Open"
      addLink="/cash-drawers/open"
      data={drawers}
      columns={columns}
      actions={actions}
      loading={loading}
      pagination={pagination}
      onPageChange={(page) =>
        setPagination((prev) => ({
          ...prev,
          page,
        }))
      }
      emptyMessage={
        serverError || t("cashDrawers.noDrawers")
      }
    />
  );
};

export default CashDrawers;