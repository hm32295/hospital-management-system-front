import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getCurrentUser } from "../../services/auth.service";


const SingleUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Get Medicine

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");
        const response =await getCurrentUser(id);
        setUser(  response.user );

      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Failed to load user"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  // Medicine Fields

  const userFields = [
    {
      key: "name",
      label: "Name",
    },

    {
      key: "email",
      label: "email",
    },
    {
      key: "role",
      label: "role",
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
            navigate("/users")
          }
        >
          Back to users
        </button>

      </div>
    );
  }

  // Render

  return (
    <div className="container-fluid">
             
      <Header buttonContent={'Back to Users'} buttonLink={'/users'} title={'user Details'}/>

      {/* Details */}

      <DetailsCard
        title="user Information"
        data={user}
        fields={userFields}
        loading={loading}
        emptyMessage="user not found"
      />

    </div>
  );
};

export default SingleUser;