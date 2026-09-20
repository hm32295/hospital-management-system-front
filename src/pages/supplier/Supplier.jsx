import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import { useTranslation } from "react-i18next";
import {
  deleteSupplier,
  getSuppliers,
} from "../../services/supplier.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Suppliers = () => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 0,
  });

  const fetchSuppliers = async () => {
    setLoading(true);

    try {
      const response = await getSuppliers({
        page: pagination.page,
        limit: pagination.limit,
      });

      setSuppliers(response.suppliers || []);

      setPagination((prev) => ({
        ...prev,
        ...response.pagination,
      }));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("suppliers.loadFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDeactivatedSupplier = async (id) => {
    setLoading(true);

    try {
      await deleteSupplier(id);

      showSuccess(t("suppliers.deactivatedSuccess"));

      await fetchSuppliers();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("suppliers.deactivateFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [pagination.page]);

  const columns = [
    {
      key: "name",
      label: t("suppliers.name"),
    },
    {
      key: "email",
      label: t("suppliers.email"),
    },
    {
      key: "phone",
      label: t("suppliers.phone"),
    },
    {
      key: "address",
      label: t("suppliers.address"),
    },
    {
      key: "isActive",
      label: t("suppliers.status"),
      render: (supplier) => (
        <span
          className={`badge ${
            supplier.isActive
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {supplier.isActive
            ? t("suppliers.active")
            : t("suppliers.inactive")}
        </span>
      ),
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("common.view"),
      link: (supplier) =>
        `/suppliers/${supplier._id}`,
    },
    {
      type: "edit",
      label: t("common.edit"),
      link: (supplier) =>
        `/suppliers/edit/${supplier._id}`,
    },
    {
      type: "delete",
      label: t("common.delete"),
      onClick: (supplier) =>
        fetchDeactivatedSupplier(supplier._id),
    },
  ];

  return (
    <AdminDataPage
      title={t("suppliers.title")}
      subtitle={t("suppliers.subtitle")}
      loading={loading}
      columns={columns}
      type="add"
      addLink="/add-suppliers"
      data={suppliers}
      actions={actions}
      pagination={pagination}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }}
    />
  );
};

export default Suppliers;