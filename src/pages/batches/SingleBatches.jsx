import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getBatchById } from "../../services/batches.service";


const SingleBatches = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batches, setBatches] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Get Batches

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getBatchById(id);
        setBatches(response.batch);
console.log(response);

      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Failed to load Batches"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBatches();
    }
  }, [id]);


  const batchesFields = [
    {
      key: "medicine",
        label: "Batches medicine name",
          render: (medicine) => {
          return medicine.name
      }
    },
    {
        key: "medicine",
        label: "Batches medicine generic name",
        render: (medicine) => {
        return medicine.genericName
    }
},
{
    key: "medicine",
    label: "Batches medicine manufacturer",
    render: (medicine) => {
    return medicine.manufacturer
    }
    },
    {
      key: "sellingPrice",
      label: "selling Price",
    },
    {
      key: "purchasePrice",
      label: "purchase Price",
    },
    {
      key: "expiryDate",
      label: "expiry Date",
    },
    {
      key: "quantity",
      label: "quantity",
    },
    {
      key: "batchNumber",
      label: "batch Number",
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
            navigate("/batches")
          }
        >
          Back to batches
        </button>

      </div>
    );
  }

  // Render

  return (
    <div className="container-fluid">
             
      <Header buttonContent={'Back to batches'} buttonLink={'/batches'} title={'Batches Details'}/>

      {/* Details */}

      <DetailsCard
        title="batches Information"
        data={batches}
        fields={batchesFields}
        loading={loading}
        emptyMessage="Batches not found"
      />

    </div>
  );
};

export default SingleBatches;