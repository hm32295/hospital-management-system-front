
import { useEffect, useState } from "react";
import {
  cancelPurchases,
  confirmPurchases,
  getPurchases,
} from "../../services/purchases.service";
import { getSuppliers } from "../../services/supplier.service";
import AdminDataPage from "../../components/table/AdminDataPage";

const Purchases = () => {
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
      const params = {page: pagination.page, limit: pagination.limit, ...filtersState};
      const response = await getPurchases(params);
      setPurchases(response.purchases || []);
      setPagination((prev) => ({...prev,...response.pagination}));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchSuppliers = async (search = "") => {
    setSupplierLoading(true);
    try {
      const response = await getSuppliers({search,page: 1,limit: 10});
      setSuppliers(response.suppliers || []);
    } catch (error) {
      console.log(error);
    } finally {
      setSupplierLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [pagination.page]);

  const handleFilter = (name, value) => {
    setFiltersState((prev) => ({...prev,[name]: value || undefined}));
    setPagination((prev) => ({...prev,page: 1}));
  };

  const fetchConfirmPurchase = async (id) => {
    setLoading(true);
    try {
      await confirmPurchases(id);
      await fetchPurchases();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCancelPurchase = async (id) => {
    setLoading(true);

    try {
      await cancelPurchases(id);
      await fetchPurchases();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    {
      name: "search",
      label: "Search",
      type: "text",
      placeholder: "Search invoice number...",
      value: filtersState.search,
      col: "col-12 col-md-6 col-lg-4",
    },
    {
      name: "supplier",
      label: "Supplier",
      type: "searchSelect",
      placeholder: supplierLoading
        ? "Loading suppliers..."
        : "Search supplier...",
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
      label: "Status",
      type: "select",
      value: filtersState.status,
      options: [
        {
          value: undefined,
          label: "All",
        },
        {
          value: "Pending",
          label: "Pending",
        },
        {
          value: "Confirmed",
          label: "Confirmed",
        },
        {
          value: "Cancelled",
          label: "Cancelled",
        },
      ],
      col: "col-12 col-md-6 col-lg-3",
    },
  ];

  const columns = [
    {
      key: "invoiceNumber",
      label: "Invoice Number",
    },
    {
      key: "purchaseDate",
      label: "Purchase Date",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (user) => user?.createdBy?.name || "-",
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (supplier) => supplier?.supplier?.name || "-",
    },
  ];


const actions = [
  {
    type: "show",
    label: "Show",
    link: (purchase) => `/purchases/${purchase._id}`,
  },
  {
    type: "cancel",
    label: "Cancel",
    hide: (purchase) => purchase.status !== "Pending",
    onClick: (purchase) => fetchCancelPurchase(purchase._id),
  },
  {
    type: "confirm",
    label: "Confirm",
    hide: (purchase) => purchase.status !== "Pending",
    onClick: (purchase) => fetchConfirmPurchase(purchase._id),
  },
];



  return (
    <AdminDataPage
      title="Purchase"
      subtitle="Manage your purchase and inventory"
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
