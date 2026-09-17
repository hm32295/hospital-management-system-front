
import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import { getStockTransaction } from "../../services/stockTransactions.service";
import { getMedicines } from "../../services/medicines.service";
import { getBatches } from "../../services/batches.service";

const StockTransaction = () => {
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
      console.error(
        "Failed to load stock transactions:",
        error
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
      console.error(
        "Failed to search medicines:",
        error
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
      console.error(
        "Failed to search batches:",
        error
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
      label: "All",
    },
    ...medicines.map((medicine) => ({
      value: medicine._id,
      label: medicine.name,
    })),
  ];

  const batchOptions = [
    {
      value: undefined,
      label: "All",
    },
    ...batches.map((batch) => ({
      value: batch._id,
      label: batch.batchNumber,
    })),
  ];

  const filters = [
    {
      name: "batch",
      label: "Batch Number",
      type: "searchSelect",
      placeholder: "Search batch...",
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
      label: "Medicine",
      type: "searchSelect",
      placeholder: "Search medicine...",
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
      label: "Type",
      type: "select",
      value: filtersState.type,
      options: [
        {
          value: undefined,
          label: "All",
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
      label: "Medicine",
      render: (medicine) =>
        medicine?.medicine?.name || "-",
    },
    {
      key: "batch",
      label: "Batch",
      render: (batch) =>
        batch?.batch?.batchNumber || "-",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "user",
      label: "User",
      render: (user) =>
        user?.user?.name || "-",
    },
    {
      key: "createdAt",
      label: "Date",
    },
  ];

  const actions = [
    {
      type: "show",
      label: "Show",
      link: (transaction) =>
        `/stock-transaction/${transaction._id}`,
    },
  ];

  return (
    <AdminDataPage
      title="Stock Transactions"
      subtitle="Manage stock movements and inventory transactions"
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
