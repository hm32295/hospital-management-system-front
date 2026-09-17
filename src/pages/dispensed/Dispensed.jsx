
import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import { getAllDispensing } from "../../services/dispensed.service";

const Dispensed = () => {
  const [dispensed, setDispensed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ limit: 10, page: 1, total: 0 })
  
  const fetchDispensed = async () => {
    setLoading(true);
    try {
      const response = await getAllDispensing({ limit: pagination.limit ,page : pagination.page});
      setDispensed(response.dispenses || []);
      setPagination((perv)=>({...perv ,...response.pagination}))
    } catch (error) {
      console.error("Failed to load dispenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispensed();
  }, [pagination.page]);

  const columns = [
    {
      key: "sale",
      label: "Sale",
      render: (row) => (
        <span>
          {row.sale?._id ? `#${row.sale._id.slice(-6)}` : "-"}
        </span>
      ),
    },
    {
      key: "patient",
      label: "Patient",
      render: (row) => (
        <span>{row.patient?.name || "-"}</span>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (row) => (
        <span>{row.reason || "-"}</span>
      ),
    },
    {
      key: "items",
      label: "Medicines",
      render: (row) => (
        <span>{row.items?.length || 0}</span>
      ),
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (row) => (
        <span>{row.createdBy?.name || "-"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => (
        <span>
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-GB")
            : "-"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      type: "show",
      label: "Show",
      link: (dispense) => `/dispenses/${dispense._id}`,
    },
  ];

  return (
    <AdminDataPage
      title="Dispenses"
      subtitle="Manage dispensed medicines"
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
    />
  );
};

export default Dispensed;
