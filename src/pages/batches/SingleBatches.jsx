
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getBatchById } from "../../services/batches.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const SingleBatches = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [batches, setBatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getBatchById(id);
        setBatches(response.batch);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          t("batches.loadDetailsFailed")
        );
        console.error(error);
        setError(message);
        showError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBatches();
    }
  }, [id, t]);

  const batchesFields = [
    {
      key: "medicine",
      label: t("batches.medicineName"),
      render: (medicine) => medicine?.name || "-",
    },
    {
      key: "medicine",
      label: t("batches.genericName"),
      render: (medicine) => medicine?.genericName || "-",
    },
    {
      key: "medicine",
      label: t("batches.manufacturer"),
      render: (medicine) => medicine?.manufacturer || "-",
    },
    {
      key: "sellingPrice",
      label: t("batches.sellingPrice"),
    },
    {
      key: "purchasePrice",
      label: t("batches.purchasePrice"),
    },
    {
      key: "expiryDate",
      label: t("batches.expiryDate"),
    },
    {
      key: "quantity",
      label: t("batches.quantity"),
    },
    {
      key: "batchNumber",
      label: t("batches.batchNumber"),
    },
    {
      key: "isActive",
      label: t("batches.status"),
      render: (value) => (
        <span
          className={`badge ${
            value
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {value
            ? t("batches.active")
            : t("batches.inactive")}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: t("batches.createdAt"),
      render: (value) =>
        value
          ? new Date(value).toLocaleString(
              i18n.language === "ar"
                ? "ar-EG"
                : "en-GB"
            )
          : "-",
    },
    {
      key: "updatedAt",
      label: t("batches.updatedAt"),
      render: (value) =>
        value
          ? new Date(value).toLocaleString(
              i18n.language === "ar"
                ? "ar-EG"
                : "en-GB"
            )
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
          onClick={() => navigate("/batches")}
        >
          {t("batches.backToBatches")}
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Header
        buttonContent={t("batches.backToBatches")}
        buttonLink="/batches"
        title={t("batches.detailsTitle")}
      />

      <DetailsCard
        title={t("batches.information")}
        data={batches}
        fields={batchesFields}
        loading={loading}
        emptyMessage={t("batches.notFound")}
      />
    </div>
  );
};

export default SingleBatches;
