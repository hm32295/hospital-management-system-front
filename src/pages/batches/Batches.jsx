
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminDataPage from "../../components/table/AdminDataPage";
import { getBatches, deleteBatch } from "../../services/batches.service";
import BarcodeModal from "../../components/barcode/BarcodeModal";
import { Barcode } from "lucide-react";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Batches = () => {
  const { t, i18n } = useTranslation();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtersState, setFiltersState] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [showBarcode, setShowBarcode] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleShowBarcode = (batch) => {
    setSelectedBatch(batch);
    setShowBarcode(true);
  };

  const handleCloseBarcode = () => {
    setShowBarcode(false);
    setSelectedBatch(null);
  };

  const fetchBatches = async () => {
    const params = filtersState
      ? {
          page: pagination.page,
          limit: pagination.limit,
          ...filtersState,
        }
      : {
          page: pagination.page,
          limit: pagination.limit,
        };

    setLoading(true);

    try {
      const response = await getBatches(params);

      setBatches(response.batches);
      setPagination((prev) => ({
        ...prev,
        ...response.pagination,
      }));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("batches.loadFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDeactivatedBatches = async (id) => {
    setLoading(true);

    try {
      const response = await deleteBatch(id);

      showSuccess(
        response?.message ||
          t("batches.deleteSuccess")
      );

      await fetchBatches();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("batches.deleteFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchBatchesPagination = async () => {
      const params = filtersState
        ? {
            page: pagination.page,
            limit: pagination.limit,
            ...filtersState,
          }
        : {
            page: pagination.page,
            limit: pagination.limit,
          };

      setLoading(true);

      try {
        const response = await getBatches(params);
        setBatches(response.batches);
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("batches.loadFailed")
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBatchesPagination();
  }, [pagination.page]);

  const filters = [
    {
      name: "search",
      label: t("batches.search"),
      type: "text",
      placeholder: t("batches.searchPlaceholder"),
      value: filtersState?.search,
      col: "col-12 col-md-6 col-lg-4",
    },
    {
      name: "expiryStatus",
      label: t("batches.expiryStatus"),
      type: "select",
      placeholder: t("batches.expiryStatusPlaceholder"),
      value: filtersState?.expiryStatus,
      col: "col-12 col-md-6 col-lg-4",
      options: [
        {
          value: "undefined",
          label: t("batches.all"),
        },
        {
          value: "expired",
          label: t("batches.expired"),
        },
        {
          value: "valid",
          label: t("batches.valid"),
        },
        {
          value: "near",
          label: t("batches.near"),
        },
      ],
    },
  ];

  const handleFilter = (name, value) => {
    setFiltersState((prev) => ({
      ...prev,
      [name]: value === "undefined" ? undefined : value,
    }));

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const columns = [
    {
      key: "medicine",
      label: t("batches.medicineName"),
      render: (batch) => batch.medicine.name,
    },
    {
      key: "genericName",
      label: t("batches.genericName"),
      render: (batch) => batch.medicine.genericName,
    },
    {
      key: "manufacturer",
      label: t("batches.manufacturer"),
      render: (batch) => batch.medicine.manufacturer,
    },
    {
      key: "batchNumber",
      label: t("batches.batchNumber"),
    },
    {
      key: "quantity",
      label: t("batches.quantity"),
    },
    {
      key: "expiryDate",
      label: t("batches.expiryDate"),
    },
    {
      key: "purchasePrice",
      label: t("batches.purchasePrice"),
    },
    {
      key: "sellingPrice",
      label: t("batches.sellingPrice"),
    },
    {
      key: "barcodeValue",
      label: t("batches.barcode"),
      render: (batch) => (
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => handleShowBarcode(batch)}
          title={t("batches.viewBarcode")}
        >
          <Barcode size={20} />
        </button>
      ),
    },
    {
      key: "isActive",
      label: t("batches.status"),
      render: (batch) => (
        <span
          className={`badge ${
            batch.isActive
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {batch.isActive
            ? t("batches.active")
            : t("batches.inactive")}
        </span>
      ),
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("common.view"),
      link: (batch) => `/batches/${batch._id}`,
    },
    {
      type: "edit",
      label: t("common.edit"),
      link: (batch) => `/batches/edit/${batch._id}`,
    },
    {
      type: "delete",
      label: t("common.delete"),
      onClick: (batch) =>
        fetchDeactivatedBatches(batch._id),
    },
  ];

  return (
    <>
      <AdminDataPage
        title={t("batches.title")}
        subtitle={t("batches.subtitle")}
        loading={loading}
        columns={columns}
        type="add"
        addLink="/add-Batches"
        data={batches}
        actions={actions}
        pagination={pagination}
        filtering={fetchBatches}
        filters={filters}
        onFilter={handleFilter}
        onPageChange={(page) => {
          setPagination((prev) => ({
            ...prev,
            page,
          }));
        }}
      />

      <BarcodeModal
        show={showBarcode}
        onClose={handleCloseBarcode}
        batch={selectedBatch}
      />
    </>
  );
};

export default Batches;
