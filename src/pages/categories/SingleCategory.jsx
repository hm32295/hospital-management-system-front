
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getCategoryById } from "../../services/category.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const SingleCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCategoryById(id);
        setCategory(response.category);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          t("categories.failedToLoad")
        );

        setError(message);
        showError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  const locale =
    i18n.language === "ar" ? "ar-EG" : "en-GB";

  const categoryFields = [
    {
      key: "name",
      label: t("categories.name"),
    },
    {
      key: "description",
      label: t("categories.description"),
    },
    {
      key: "isActive",
      label: t("categories.status"),
      render: (value) => (
        <span
          className={`badge ${
            value
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {value
            ? t("categories.active")
            : t("categories.inactive")}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: t("categories.createdAt"),
      render: (value) =>
        value
          ? new Date(value).toLocaleString(locale)
          : "-",
    },
    {
      key: "updatedAt",
      label: t("categories.updatedAt"),
      render: (value) =>
        value
          ? new Date(value).toLocaleString(locale)
          : "-",
    },
  ];

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/categories")}
        >
          {t("categories.backToCategories")}
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Header
        buttonContent={t("categories.backToCategories")}
        buttonLink="/categories"
        title={t("categories.detailsTitle")}
      />

      <DetailsCard
        title={t("categories.information")}
        data={category}
        fields={categoryFields}
        loading={loading}
        emptyMessage={t("categories.notFound")}
      />
    </div>
  );
};

export default SingleCategory;