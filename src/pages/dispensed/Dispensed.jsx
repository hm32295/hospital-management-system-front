
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import AdminDataPage from "../../components/table/AdminDataPage";
import { getAllDispensing } from "../../services/dispensed.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Dispensed = () => {
  const { t, i18n } = useTranslation();

  const [dispensed, setDispensed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 0,
  });

  const fetchDispensed = async () => {
    setLoading(true);

    try {
      const response = await getAllDispensing({
        limit: pagination.limit,
        page: pagination.page,
      });

      setDispensed(response.dispenses || []);

      setPagination((prev) => ({
        ...prev,
        ...(response.pagination || {}),
      }));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("dispensing.failedToLoad")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispensed();
  }, [pagination.page]);

  const locale =
    i18n.language === "ar" ? "ar-EG" : "en-GB";

  const columns = [
    {
      key: "sale",
      label: t("dispensing.sale"),
      render: (row) => (
        <span>
          {row.sale?._id
            ? `#${row.sale._id.slice(-6)}`
            : "-"}
        </span>
      ),
    },
    {
      key: "patient",
      label: t("dispensing.patient"),
      render: (row) => (
        <span>{row.patient?.name || "-"}</span>
      ),
    },
    {
      key: "reason",
      label: t("dispensing.reason"),
      render: (row) => (
        <span>{row.reason || "-"}</span>
      ),
    },
    {
      key: "items",
      label: t("dispensing.medicines"),
      render: (row) => (
        <span>{row.items?.length || 0}</span>
      ),
    },
    {
      key: "createdBy",
      label: t("dispensing.createdBy"),
      render: (row) => (
        <span>{row.createdBy?.name || "-"}</span>
      ),
    },
    {
      key: "createdAt",
      label: t("dispensing.date"),
      render: (row) => (
        <span>
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString(
                locale
              )
            : "-"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("common.view"),
      link: (dispense) =>
        `/dispenses/${dispense._id}`,
    },
  ];

  return (
    <AdminDataPage
      title={t("dispensing.listTitle")}
      subtitle={t("dispensing.listDescription")}
      loading={loading}
      columns={columns}
      type="add"
      addLink="/add-dispense"
      data={dispensed}
      actions={actions}
      pagination={pagination}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }}
      emptyMessage={t("dispensing.noDispenses")}
    />
  );
};

export default Dispensed;
