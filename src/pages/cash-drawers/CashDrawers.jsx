
import { useEffect, useState } from "react";
import { getAllCashDrawers } from "../../services/cashDrawer.service";
import AdminDataPage from "../../components/table/AdminDataPage";

const CashDrawers = () => {
  const [drawers, setDrawers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  const [pagination, setPagination] = useState({page: 1,total: 0,limit: 10});

  const fetchDrawers = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await getAllCashDrawers({
        page: pagination.page,limit: pagination.limit,
      });

      setDrawers(response.cashDrawers || []);
      setPagination((prev) => ({
        ...prev,
        ...(response.pagination || {}),
      }));
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Failed to load cash drawers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrawers();
  }, []);
  useEffect(() => {
      const fetchDrawers = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await getAllCashDrawers({page: pagination.page,limit: pagination.limit});

      setDrawers(response.cashDrawers || []);

    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Failed to load cash drawers"
      );
    } finally {
      setLoading(false);
    }
  };
    fetchDrawers();
  }, [pagination]);

  const columns = [
    {
      key: "openedBy",
      label: "Opened By",
      render: (drawer) => drawer.openedBy?.name || "-",
    },

    {
      key: "openingBalance",
      label: "Opening",
      render: (drawer) =>
        `${Number(drawer.openingBalance || 0).toFixed(2)} EGP`,
    },

    {
      key: "expectedCash",
      label: "Expected",
      render: (drawer) =>
        `${Number(drawer.expectedCash || 0).toFixed(2)} EGP`,
    },

    {
      key: "actualCash",
      label: "Actual",
      render: (drawer) =>
        drawer.status === "closed"
          ? `${Number(drawer.actualCash || 0).toFixed(2)} EGP`
          : "-",
    },

    {
      key: "difference",
      label: "Difference",
      render: (drawer) =>
        drawer.status === "closed"
          ? `${Number(drawer.difference || 0).toFixed(2)} EGP`
          : "-",
    },

    {
      key: "status",
      label: "Status",
      render: (drawer) => (
        <span
          className={`badge ${
            drawer.status === "open"
              ? "text-bg-success"
              : "text-bg-secondary"
          }`}
        >
          {drawer.status}
        </span>
      ),
    },

    {
      key: "openedAt",
      label: "Opened At",
      render: (drawer) =>
        drawer.openedAt
          ? new Date(drawer.openedAt).toLocaleDateString("en-GB")
          : "-",
    },
  ];

  const actions = [
    {
      type: "show",
      label: "View Cash Drawer",
      link: (drawer) => `/cash-drawers/${drawer._id}`,
    },
  ];

  return (
    <AdminDataPage
      title="Cash Drawers"
      subtitle="View all cash drawer sessions"
      type="Open"
      addLink="/cash-drawers/open"
      data={drawers}
      columns={columns}
      actions={actions}
      loading={loading}
      pagination={pagination}
      onPageChange={(page) =>
        setPagination((prev) => ({...prev ,page}))
      }
      emptyMessage={
        serverError || "No cash drawers found"
      }
    />
  );
};

export default CashDrawers;