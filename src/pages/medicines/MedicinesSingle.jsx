import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMedicineById } from "../../services/medicines.service";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";


const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Get Medicine

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        setError("");
        const response =await getMedicineById(id);
        setMedicine(  response.medicine );

      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Failed to load medicine"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedicine();
    }
  }, [id]);

  // Medicine Fields

  const medicineFields = [
    {
      key: "name",
      label: "Medicine Name",
    },

    {
      key: "genericName",
      label: "Generic Name",
    },

    {
      key: "category.name",
      label: "Category",
    },

    {
      key: "manufacturer",
      label: "Manufacturer",
    },

    {
      key: "description",
      label: "Description",
      col: "col-12",
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
            navigate("/medicines")
          }
        >
          Back to Medicines
        </button>

      </div>
    );
  }

  // Render

  return (
    <div className="container-fluid">
             
      <Header buttonContent={'Back to Medicines'} buttonLink={'/medicines'} title={'Medicine Details'}/>

      {/* Details */}

      <DetailsCard
        title="Medicine Information"
        data={medicine}
        fields={medicineFields}
        loading={loading}
        emptyMessage="Medicine not found"
      />

    </div>
  );
};

export default MedicineDetails;