
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getPurchasesById } from "../../services/purchases.service";
import AdminDataPage from "../../components/table/AdminDataPage";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const SinglePurchases = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        setLoading(true);

        const response = await getPurchasesById(id);
        console.log(response.purchase);

        setPurchase(response.purchase || {});
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("purchases.loadDetailsFailed")
          )
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPurchase();
    }
  }, [id]);

  const locale = i18n.language === "ar" ? "ar-EG" : "en-EG";

  const formatDate = (value) =>{
    console.log(value);
    
    return value
      ? new Date(value.expiryDate).toLocaleDateString(locale)
      : "-";
}
  const formatDateTime = (value) =>
    value
      ? new Date(value).toLocaleString(locale)
      : "-";

  const formatMoney = (value) =>{
    
    
  value !== undefined && value !== null
    ? `${Number(value).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${t("common.egp")}`
    : "-";
}
  const medicinesFields = [
    {
      key: "batchNumber",
      label: t("purchases.batchNumber"),
    },
    {
      key: "expiryDate",
      label: t("purchases.expiryDate"),
      render: (value) => formatDate(value),
    },
    {
      key: "purchasePrice",
      label: t("purchases.purchasePrice"),
      render: (value) => (value?.purchasePrice),
    },
    {
      key: "quantity",
      label: t("purchases.quantity"),
    },
    {
      key: "medicine",
      label: t("purchases.medicine"),
      render: (medicine) =>
        medicine?.medicine?.name || "-",
      nav: (medicine) =>
        medicine?._id
          ? `/medicines/${medicine._id}`
          : null,
    },
  ];

  const purchaseFields = [
    {
      key: "invoiceNumber",
      label: t("purchases.invoiceNumber"),
    },
    {
      key: "purchaseDate",
      label: t("purchases.purchaseDate"),
      render: (value) => formatDate(value),
    },
    {
      key: "createdBy",
      label: t("purchases.createdBy"),
      render: (user) => user?.name || "-",
      nav: (user) =>
        user?._id
          ? `/users/${user._id}`
          : null,
    },
    {
      key: "supplier",
      label: t("purchases.supplier"),
      render: (supplier) =>
        supplier?.name || "-",
      nav: (supplier) =>
        supplier?._id
          ? `/suppliers/${supplier._id}`
          : null,
    },
    {
      key: "status",
      label: t("purchases.status"),
      render: (value) => {
        const statusKey =
          String(value || "").toLowerCase();

        return t(
          `purchases.statuses.${statusKey}`,
          {
            defaultValue: value || "-",
          }
        );
      },
    },
    {
      key: "totalAmount",
      label: t("purchases.totalAmount"),
      render: (value) => formatMoney(value),
    },
    {
      key: "createdAt",
      label: t("purchases.createdAt"),
      render: (value) => formatDateTime(value),
    },
    {
      key: "updatedAt",
      label: t("purchases.updatedAt"),
      render: (value) => formatDateTime(value),
    },
  ];

  if (!loading && !purchase?._id) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          {t("purchases.notFound")}
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/purchases")}
        >
          {t("purchases.backToPurchases")}
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Header
        buttonContent={t("purchases.backToPurchases")}
        buttonLink="/purchases"
        title={t("purchases.purchaseDetails")}
      />

      <DetailsCard
        title={t("purchases.purchaseInformation")}
        data={purchase}
        fields={purchaseFields}
        loading={loading}
        emptyMessage={t("purchases.notFound")}
      />

      <div>{t("purchases.medicines")}</div>

      <AdminDataPage
        loading={loading}
        columns={medicinesFields}
        data={purchase.items || []}
      />

      {!loading &&
        (!purchase?.items ||
          purchase.items.length === 0) && (
          <div className="alert alert-info mt-4">
            {t("purchases.noMedicinesFound")}
          </div>
        )}
    </div>
  );
};

export default SinglePurchases;