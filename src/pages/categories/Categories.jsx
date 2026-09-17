import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import {
  deleteCategory,
  getCategory,
} from "../../services/category.service";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [filtersState, setFiltersState] = useState({});
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 0,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await getCategory({limit: pagination.limit, page: pagination.page,...filtersState});
      setCategories(response.categories || []);
      if (response.pagination) {
        setPagination((prev) => ({...prev,...response.pagination}));
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDeactivatedCategory = async (id) => {
    try {
      setLoading(true);
      setServerError("");

      await deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Failed to deactivate category"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [pagination.page]);

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

  const filters = [
    {
      name: "search",
      label: "Search",
      type: "text",
      placeholder: "Search category...",
      value: filtersState.search,
      col: "col-12 col-md-6 col-lg-4",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Category",
    },
    {
      key: "isActive",
      label: "Status",
      render: (category) => (
        <span
          className={`badge ${
            category.isActive
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {category.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (category) => {
        if (!category.description) {
          return "-";
        }

        const words = category.description
          .trim()
          .split(/\s+/);

        if (words.length <= 3) {
          return words.join(" ");
        }

        return `${words.slice(0, 3).join(" ")}...`;
      },
    },
  ];

  const actions = [
    {
      type: "show",
      label: "Show",
      link: (category) =>
        `/categories/${category._id}`,
    },
    {
      type: "edit",
      label: "Edit",
      link: (category) =>
        `/categories/edit/${category._id}`,
    },
    {
      type: "delete",
      label: "Delete",
      onClick: (category) =>
        fetchDeactivatedCategory(category._id),
    },
  ];

  return (
    <AdminDataPage
      title="Categories"
      subtitle="Manage your categories and inventory"
      loading={loading}
      columns={columns}
      filters={filters}
      onFilter={handleFilter}
      filtering={fetchCategories}
      type="add"
      addLink="/add-categories"
      data={categories}
      actions={actions}
      pagination={pagination}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }}
      emptyMessage={
        serverError || "No categories found"
      }
    />
  );
};

export default Categories;