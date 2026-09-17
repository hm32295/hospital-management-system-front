import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getSupplierById } from "../../services/supplier.service";


const SingleSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Supplier, setSupplier] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Get Supplier

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getSupplierById(id);
        setSupplier(response.supplier);

      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Failed to load Supplier"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSupplier();
    }
  }, [id]);

  // Supplier Fields

  const supplierFields = [
    {
      key: "name",
      label: "Supplier Name",
    },
    {
      key: "email",
      label: "email",
    },
    {
      key: "address",
      label: "address",
    },
    {
      key: "phone",
      label: "phone",
    },

    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span
          className={`badge ${
            value
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created At",

      render: (value) =>
        value
          ? new Date(
              value
            ).toLocaleString()
          : "-",
    },

    {
      key: "updatedAt",
      label: "Updated At",

      render: (value) =>
        value
          ? new Date(
              value
            ).toLocaleString()
          : "-",
    },
  ];

  // Error

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
            navigate("/suppliers")
          }
        >
          Back to suppliers
        </button>

      </div>
    );
  }

  // Render

  return (
    <div className="container-fluid">
             
      <Header buttonContent={'Back to suppliers'} buttonLink={'/suppliers'} title={'Supplier Details'}/>

      {/* Details */}

      <DetailsCard
        title="suppliers Information"
        data={Supplier}
        fields={supplierFields}
        loading={loading}
        emptyMessage="Supplier not found"
      />

    </div>
  );
};

export default SingleSupplier;