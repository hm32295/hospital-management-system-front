
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getSupplierById } from "../../services/supplier.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const SingleSupplier = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);

        const response = await getSupplierById(id);

        setSupplier(response.supplier);
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("suppliers.loadDetailsFailed")
          )
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSupplier();
    }
  }, [id]);

  const supplierFields = [
    {
      key: "name",
      label: t("suppliers.supplierName"),
    },
    {
      key: "email",
      label: t("suppliers.email"),
    },
    {
      key: "address",
      label: t("suppliers.address"),
    },
    {
      key: "phone",
      label: t("suppliers.phone"),
    },
    {
      key: "isActive",
      label: t("suppliers.status"),
      render: (value) => (
        <span
          className={`badge ${
            value
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {value
            ? t("suppliers.active")
            : t("suppliers.inactive")}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: t("suppliers.createdAt"),
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
      label: t("suppliers.updatedAt"),
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

  return (
    <div className="container-fluid">
      <Header
        buttonContent={t("suppliers.backToSuppliers")}
        buttonLink="/suppliers"
        title={t("suppliers.supplierDetails")}
      />

      <DetailsCard
        title={t("suppliers.supplierInformation")}
        data={supplier}
        fields={supplierFields}
        loading={loading}
        emptyMessage={t("suppliers.notFound")}
      />
    </div>
  );
};

export default SingleSupplier;