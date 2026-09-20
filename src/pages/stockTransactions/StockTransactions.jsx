
import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import { getStockTransaction } from "../../services/stockTransactions.service";
import { getMedicines } from "../../services/medicines.service";
import { getBatches } from "../../services/batches.service";
import { useTranslation } from "react-i18next";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const StockTransaction = () => {
  const { t } = useTranslation();
  const [stockTransaction, setStockTransaction] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 10,
  });

  const [filtersState, setFiltersState] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);

  const fetchStockTransaction = async () => {
    setLoading(true);

    try {
      const response = await getStockTransaction({
        page: pagination.page,
        limit: pagination.limit,
        ...filtersState,
      });

      setStockTransaction(response.transactions || []);

      setPagination((prev) => ({
        ...prev,
        ...response.pagination,
      }));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("stockTransactions.loadFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const searchMedicines = async (search) => {
    setMedicinesLoading(true);

    try {
      const response = await getMedicines({
        search,
        page: 1,
        limit: 10,
      });

      setMedicines(response.medicines || []);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("stockTransactions.searchMedicinesFailed")
        )
      );
      setMedicines([]);
    } finally {
      setMedicinesLoading(false);
    }
  };

  const searchBatches = async (search) => {
    setBatchesLoading(true);

    try {
      const response = await getBatches({
        search,
        page: 1,
        limit: 10,
      });

      setBatches(response.batches || []);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("stockTransactions.searchBatchesFailed")
        )
      );
      setBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  };

  useEffect(() => {
    fetchStockTransaction();
  }, [pagination.page]);

  const medicineOptions = [
    {
      value: undefined,
      label: t("stockTransactions.all"),
    },
    ...medicines.map((medicine) => ({
      value: medicine._id,
      label: medicine.name,
    })),
  ];

  const batchOptions = [
    {
      value: undefined,
      label: t("stockTransactions.all"),
    },
    ...batches.map((batch) => ({
      value: batch._id,
      label: batch.batchNumber,
    })),
  ];

  const filters = [
    {
      name: "batch",
      label: t("stockTransactions.batchNumber"),
      type: "searchSelect",
      placeholder: t("stockTransactions.searchBatch"),
      value: filtersState.batch,
      options: batchOptions,
      serverSearch: true,
      onSearch: searchBatches,
      loading: batchesLoading,
      minSearchLength: 2,
      debounceDelay: 400,
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "medicine",
      label: t("stockTransactions.medicine"),
      type: "searchSelect",
      placeholder: t("stockTransactions.searchMedicine"),
      value: filtersState.medicine,
      options: medicineOptions,
      serverSearch: true,
      onSearch: searchMedicines,
      loading: medicinesLoading,
      minSearchLength: 2,
      debounceDelay: 400,
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "type",
      label: t("stockTransactions.type"),
      type: "select",
      value: filtersState.type,
      options: [
        {
          value: undefined,
          label: t("stockTransactions.all"),
        },
        {
          value: "IN",
          label: "IN",
        },
        {
          value: "OUT",
          label: "OUT",
        },
      ],
      col: "col-12 col-md-6 col-lg-2",
    },
  ];

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

  const columns = [
    {
      key: "medicine",
      label: t("stockTransactions.medicine"),
      render: (medicine) =>
        medicine?.medicine?.name || "-",
    },
    {
      key: "batch",
      label: t("stockTransactions.batch"),
      render: (batch) =>
        batch?.batch?.batchNumber || "-",
    },
    {
      key: "type",
      label: t("stockTransactions.type"),
    },
    {
      key: "quantity",
      label: t("stockTransactions.quantity"),
    },
    {
      key: "reason",
      label: t("stockTransactions.reason"),
    },
    {
      key: "user",
      label: t("stockTransactions.user"),
      render: (user) =>
        user?.user?.name || "-",
    },
    {
      key: "createdAt",
      label: t("stockTransactions.date"),
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("common.view"),
      link: (transaction) =>
        `/stock-transaction/${transaction._id}`,
    },
  ];

  return (
    <AdminDataPage
      title={t("stockTransactions.title")}
      subtitle={t("stockTransactions.subtitle")}
      loading={loading}
      columns={columns}
      actions={actions}
      onFilter={handleFilter}
      filters={filters}
      type="add"
      addLink="/add-stock-transaction"
      data={stockTransaction}
      pagination={pagination}
      filtering={fetchStockTransaction}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }}
    />
  );
};

export default StockTransaction;