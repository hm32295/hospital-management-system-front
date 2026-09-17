import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getCategoryById } from "../../services/category.service";


const SingleCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Get category

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getCategoryById(id);
        
        setCategory(response.category);

      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Failed to load category"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  // category Fields

  const categoryFields = [
    {
      key: "name",
      label: "category Name",
    },

    {
      key: "description",
      label: "description",
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
            navigate("/categories")
          }
        >
          Back to categories
        </button>

      </div>
    );
  }

  // Render

  return (
    <div className="container-fluid">
             
      <Header buttonContent={'Back to categories'} buttonLink={'/categories'} title={'category Details'}/>

      {/* Details */}

      <DetailsCard
        title="categories Information"
        data={category}
        fields={categoryFields}
        loading={loading}
        emptyMessage="category not found"
      />

    </div>
  );
};

export default SingleCategory;