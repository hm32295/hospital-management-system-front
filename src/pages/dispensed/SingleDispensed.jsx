
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  UserRound,
  ReceiptText,
  PackageCheck,
  UserCog,
  CalendarDays,
} from "lucide-react";

import Header from "../../components/header/Header";
import { getSingleDispensing } from "../../services/dispensed.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const SingleDispensed = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [dispensing, setDispensing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const locale =
    i18n.language === "ar" ? "ar-EG" : "en-GB";

  const fetchDispensing = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSingleDispensing(id);

      setDispensing(response.dispense || response);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        t("dispensing.failedToLoad")
      );

      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispensing();
  }, [id]);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />

          <div className="mt-3 text-muted">
            {t("dispensing.loading")}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-light border"
          onClick={() => navigate("/dispenses")}
        >
          <ArrowLeft size={17} className="me-2" />
          {t("dispensing.backToDispenses")}
        </button>
      </div>
    );
  }

  if (!dispensing) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">
          {t("dispensing.notFound")}
        </div>

        <button
          type="button"
          className="btn btn-light border"
          onClick={() => navigate("/dispenses")}
        >
          <ArrowLeft size={17} className="me-2" />
          {t("dispensing.backToDispenses")}
        </button>
      </div>
    );
  }

  const patient = dispensing.patient;
  const sale = dispensing.sale;
  const createdBy = dispensing.createdBy;
  const items = dispensing.items || [];

  return (
    <div>
      <Header
        title={t("dispensing.detailsTitle")}
        description={t("dispensing.detailsDescription")}
      />

      <div className="container-fluid pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            type="button"
            className="btn btn-light border"
            onClick={() => navigate("/dispenses")}
          >
            <ArrowLeft size={17} className="me-2" />
            {t("dispensing.backToDispenses")}
          </button>

          <span className="badge text-bg-success px-3 py-2">
            {t("dispensing.dispensed")}
          </span>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <UserRound size={20} />
                  <h5 className="mb-0">
                    {t("dispensing.patient")}
                  </h5>
                </div>

                <div className="fw-semibold fs-5">
                  {patient?.name ||
                    t("dispensing.noPatient")}
                </div>

                {patient?.phone && (
                  <div className="text-muted mt-1">
                    {patient.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <ReceiptText size={20} />
                  <h5 className="mb-0">
                    {t("dispensing.sale")}
                  </h5>
                </div>

                {sale?._id ? (
                  <>
                    <div className="fw-semibold fs-5">
                      #{sale._id.slice(-6)}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <span>
                        {t("dispensing.total")}
                      </span>

                      <strong>
                        {Number(
                          sale.totalAmount || 0
                        ).toFixed(2)}{" "}
                        {t("common.egp")}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <span>
                        {t("dispensing.paid")}
                      </span>

                      <strong className="text-success">
                        {Number(
                          sale.paidAmount || 0
                        ).toFixed(2)}{" "}
                        {t("common.egp")}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <span>
                        {t("dispensing.status")}
                      </span>

                      <span className="badge text-bg-success">
                        {sale.paymentStatus ||
                          "paid"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-muted">
                    {t(
                      "dispensing.notLinkedToSale"
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <UserCog size={20} />
                  <h5 className="mb-0">
                    {t("dispensing.createdBy")}
                  </h5>
                </div>

                <div className="fw-semibold">
                  {createdBy?.name || "-"}
                </div>

                {createdBy?.role && (
                  <div className="text-muted small mt-1">
                    {createdBy.role}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <CalendarDays size={20} />
                  <h5 className="mb-0">
                    {t("dispensing.dispensingDate")}
                  </h5>
                </div>

                <div className="fw-semibold">
                  {dispensing.createdAt
                    ? new Date(
                        dispensing.createdAt
                      ).toLocaleDateString(locale)
                    : "-"}
                </div>

                {dispensing.createdAt && (
                  <div className="text-muted small mt-1">
                    {new Date(
                      dispensing.createdAt
                    ).toLocaleTimeString(locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <PackageCheck size={20} />
                  <h5 className="mb-0">
                    {t(
                      "dispensing.dispensedMedicines"
                    )}
                  </h5>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t("dispensing.medicine")}</th>
                        <th>{t("dispensing.genericName")}</th>
                        <th>{t("dispensing.batch")}</th>
                        <th>{t("dispensing.expiry")}</th>
                        <th>{t("dispensing.quantity")}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.length > 0 ? (
                        items.map((item, index) => (
                          <tr
                            key={`${
                              item.medicine?._id ||
                              index
                            }-${index}`}
                          >
                            <td>{index + 1}</td>

                            <td>
                              <div className="fw-semibold">
                                {item.medicine?.name ||
                                  "-"}
                              </div>

                              {item.medicine
                                ?.manufacturer && (
                                <div className="text-muted small">
                                  {
                                    item.medicine
                                      .manufacturer
                                  }
                                </div>
                              )}
                            </td>

                            <td>
                              {item.medicine
                                ?.genericName || "-"}
                            </td>

                            <td>
                              {item.batch
                                ?.batchNumber ||
                                item.batch ||
                                "-"}
                            </td>

                            <td>
                              {item.batch?.expiryDate
                                ? new Date(
                                    item.batch
                                      .expiryDate
                                  ).toLocaleDateString(
                                    locale
                                  )
                                : item.batch || "-"}
                            </td>

                            <td>
                              <span className="badge text-bg-primary">
                                {item.quantity || 0}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center text-muted py-4"
                          >
                            {t(
                              "dispensing.noMedicines"
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-3">
                  {t("dispensing.reason")}
                </h5>

                <div className="bg-light rounded p-3">
                  {dispensing.reason || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDispensed;