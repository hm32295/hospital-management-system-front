import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getMedicineById } from "../../services/medicines.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";

const MedicineSingle = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMedicine = async () => {
    try {
      setLoading(true);

      const response = await getMedicineById(id);
      setMedicine(response.medicine);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("medicines.failedLoad")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMedicine();
    }
  }, [id]);

  const medicineFields = [
    {
      key: "name",
      label: t("medicines.medicineName"),
    },
    {
      key: "genericName",
      label: t("medicines.genericName"),
    },
    {
      key: "category.name",
      label: t("medicines.category"),
    },
    {
      key: "manufacturer",
      label: t("medicines.manufacturer"),
    },
    {
      key: "description",
      label: t("medicines.description"),
      col: "col-12",
    },
    {
      key: "isActive",
      label: t("medicines.status"),
      render: (value) => (
        <span
          className={`badge ${
            value
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {value
            ? t("medicines.statuses.active")
            : t("medicines.statuses.inactive")}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: t("medicines.createdAt"),
      render: (value) =>
        value
          ? new Date(value).toLocaleString(
              i18n.language === "ar"
                ? "ar-EG"
                : "en-EG"
            )
          : "-",
    },
    {
      key: "updatedAt",
      label: t("medicines.updatedAt"),
      render: (value) =>
        value
          ? new Date(value).toLocaleString(
              i18n.language === "ar"
                ? "ar-EG"
                : "en-EG"
            )
          : "-",
    },
  ];

  return (
    <div className="container-fluid">
      <Header
        buttonContent={t("medicines.backToMedicines")}
        buttonLink="/medicines"
        title={t("medicines.medicineDetails")}
      />

      <DetailsCard
        title={t("medicines.medicineInformation")}
        data={medicine}
        fields={medicineFields}
        loading={loading}
        emptyMessage={t("medicines.notFound")}
      />
    </div>
  );
};

export default MedicineSingle;