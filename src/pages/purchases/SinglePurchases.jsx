import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getPurchasesById } from "../../services/purchases.service";
import AdminDataPage from "../../components/table/AdminDataPage";

const SinglePurchases = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPurchasesById(id);
console.log(response.purchase);

        setPurchase(response.purchase);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load purchase"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPurchase();
    }
  }, [id]);

  /*
   * =========================
   * Medicine Fields
   * =========================
   */
  const medicinesFields = [
    {
      key: "batchNumber",
      label: "Batch Number",
    },
    {
      key: "expiryDate",
      label: "Expiry Date",
    },
    {
      key: "purchasePrice",
      label: "Purchase Price",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "medicine",
      label: "Medicine",
      render: (medicine) => medicine?.medicine?.name || "-",
      nav: (medicine) =>
        medicine?._id
          ? `/medicines/${medicine._id}`
          : null,
    },
  ];

  /*
   * =========================
   * Purchase Fields
   * =========================
   */
  const purchaseFields = [
    {
      key: "invoiceNumber",
      label: "Invoice Number",
    },

    {
      key: "purchaseDate",
      label: "Purchase Date",
    },

    {
      key: "createdBy",
      label: "Created By",
      render: (user) => user?.name || "-",
      nav: (user) =>
        user?._id
          ? `/users/${user._id}`
          : null,
    },

    {
      key: "supplier",
      label: "Supplier",
      render: (supplier) =>
        supplier?.name || "-",
      nav: (supplier) =>
        supplier?._id
          ? `/suppliers/${supplier._id}`
          : null,
    },

    {
      key: "status",
      label: "Status",
    },

    {
      key: "totalAmount",
      label: "Total Amount",
    },

    {
      key: "createdAt",
      label: "Created At",
      render: (value) =>
        value
          ? new Date(value).toLocaleString()
          : "-",
    },

    {
      key: "updatedAt",
      label: "Updated At",
      render: (value) =>
        value
          ? new Date(value).toLocaleString()
          : "-",
    },
  ];

  /*
   * =========================
   * Error
   * =========================
   */
  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            navigate("/purchases")
          }
        >
          Back to Purchases
        </button>
      </div>
    );
  }

  /*
   * =========================
   * Render
   * =========================
   */
  return (
    <div className="container-fluid">

      <Header
        buttonContent="Back to Purchases"
        buttonLink="/purchases"
        title="Purchase Details"
      />

      {/* Purchase Information */}

      <DetailsCard
        title="Purchase Information"
        data={purchase}
        fields={purchaseFields}
        loading={loading}
        emptyMessage="Purchase not found"
      />

      {/* Medicines */}
<div>Medicines</div>
    <AdminDataPage
      loading={loading}
      columns={medicinesFields}
      data={purchase.items}
    />
      {!loading &&
        (!purchase?.items ||
          purchase.items.length === 0) && (
          <div className="alert alert-info mt-4">
            No medicines found for this purchase.
          </div>
        )}

    </div>
  );
};

export default SinglePurchases;