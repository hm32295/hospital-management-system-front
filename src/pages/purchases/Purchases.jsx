
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  cancelPurchases,
  confirmPurchases,
  getPurchases,
} from "../../services/purchases.service";
import { getSuppliers } from "../../services/supplier.service";
import AdminDataPage from "../../components/table/AdminDataPage";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Purchases = () => {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supplierLoading, setSupplierLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 10,
  });

  const [filtersState, setFiltersState] = useState({});

  const fetchPurchases = async () => {
    setLoading(true);

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filtersState,
      };

      const response = await getPurchases(params);

      setPurchases(response.purchases || []);
      setPagination((prev) => ({
        ...prev,
        ...response.pagination,
      }));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("purchases.loadFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const searchSuppliers = async (search = "") => {
    setSupplierLoading(true);

    try {
      const response = await getSuppliers({
        search,
        page: 1,
        limit: 10,
      });

      setSuppliers(response.suppliers || []);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("purchases.searchSuppliersFailed")
        )
      );
    } finally {
      setSupplierLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
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

  const fetchConfirmPurchase = async (id) => {
    setLoading(true);

    try {
      await confirmPurchases(id);

      showSuccess(t("purchases.confirmSuccess"));

      await fetchPurchases();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("purchases.confirmFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCancelPurchase = async (id) => {
    setLoading(true);

    try {
      await cancelPurchases(id);

      showSuccess(t("purchases.cancelSuccess"));

      await fetchPurchases();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("purchases.cancelFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    {
      name: "search",
      label: t("purchases.search"),
      type: "text",
      placeholder: t("purchases.searchInvoice"),
      value: filtersState.search,
      col: "col-12 col-md-6 col-lg-4",
    },
    {
      name: "supplier",
      label: t("purchases.supplier"),
      type: "searchSelect",
      placeholder: supplierLoading
        ? t("purchases.loadingSuppliers")
        : t("purchases.searchSupplier"),
      value: filtersState.supplier,
      options: suppliers.map((supplier) => ({
        value: supplier._id,
        label: supplier.name,
      })),
      serverSearch: true,
      onSearch: searchSuppliers,
      loading: supplierLoading,
      minSearchLength: 2,
      debounceDelay: 400,
      col: "col-12 col-md-6 col-lg-4",
    },
    {
      name: "status",
      label: t("purchases.status"),
      type: "select",
      value: filtersState.status,
      options: [
        {
          value: undefined,
          label: t("purchases.all"),
        },
        {
          value: "Pending",
          label: t("purchases.statuses.pending"),
        },
        {
          value: "Confirmed",
          label: t("purchases.statuses.confirmed"),
        },
        {
          value: "Cancelled",
          label: t("purchases.statuses.cancelled"),
        },
      ],
      col: "col-12 col-md-6 col-lg-3",
    },
  ];

  const columns = [
    {
      key: "invoiceNumber",
      label: t("purchases.invoiceNumber"),
    },
    {
      key: "purchaseDate",
      label: t("purchases.purchaseDate"),
    },
    {
      key: "status",
      label: t("purchases.status"),
    },
    {
      key: "createdBy",
      label: t("purchases.createdBy"),
      render: (user) => user?.createdBy?.name || "-",
    },
    {
      key: "supplier",
      label: t("purchases.supplier"),
      render: (supplier) => supplier?.supplier?.name || "-",
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("purchases.show"),
      link: (purchase) => `/purchases/${purchase._id}`,
    },
    {
      type: "cancel",
      label: t("common.cancel"),
      hide: (purchase) => purchase.status !== "Pending",
      onClick: (purchase) =>
        fetchCancelPurchase(purchase._id),
    },
    {
      type: "confirm",
      label: t("common.confirm"),
      hide: (purchase) => purchase.status !== "Pending",
      onClick: (purchase) =>
        fetchConfirmPurchase(purchase._id),
    },
  ];

  return (
    <AdminDataPage
      title={t("purchases.title")}
      subtitle={t("purchases.subtitle")}
      loading={loading}
      columns={columns}
      type="add"
      addLink="/add-purchases"
      data={purchases}
      actions={actions}
      pagination={pagination}
      filters={filters}
      onFilter={handleFilter}
      filtering={fetchPurchases}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }}
    />
  );
};

export default Purchases;