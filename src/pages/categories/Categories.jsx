
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import AdminDataPage from "../../components/table/AdminDataPage";
import {
  deleteCategory,
  getCategory,
} from "../../services/category.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Categories = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtersState, setFiltersState] = useState({});
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 0,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getCategory({
        limit: pagination.limit,
        page: pagination.page,
        ...filtersState,
      });

      setCategories(response.categories || []);

      if (response.pagination) {
        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      }
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("categories.failedToLoad")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDeactivatedCategory = async (id) => {
    try {
      setLoading(true);

      const response = await deleteCategory(id);

      showSuccess(
        response?.message || t("categories.deactivateSuccess")
      );

      await fetchCategories();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("categories.failedToDeactivate")
        )
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
      label: t("categories.search"),
      type: "text",
      placeholder: t("categories.searchPlaceholder"),
      value: filtersState.search,
      col: "col-12 col-md-6 col-lg-4",
    },
  ];

  const columns = [
    {
      key: "name",
      label: t("categories.category"),
    },
    {
      key: "isActive",
      label: t("categories.status"),
      render: (category) => (
        <span
          className={`badge ${
            category.isActive
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {category.isActive
            ? t("categories.active")
            : t("categories.inactive")}
        </span>
      ),
    },
    {
      key: "description",
      label: t("categories.description"),
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
      label: t("common.view"),
      link: (category) =>
        `/categories/${category._id}`,
    },
    {
      type: "edit",
      label: t("common.edit"),
      link: (category) =>
        `/categories/edit/${category._id}`,
    },
    {
      type: "delete",
      label: t("common.delete"),
      onClick: (category) =>
        fetchDeactivatedCategory(category._id),
    },
  ];

  return (
    <AdminDataPage
      title={t("categories.listTitle")}
      subtitle={t("categories.listDescription")}
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
      emptyMessage={t("categories.noCategories")}
    />
  );
};

export default Categories;