
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Wallet,
  UserRound,
  Stethoscope,
  Activity,
  ShoppingCart,
  Receipt,
  CreditCard,
  FileText,
  Banknote,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import DetailsCard from "../../components/details/DetailsCard";
import {
  getCashTransaction,
} from "../../services/cashTransactions.service";

import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const CashTransactionDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [transaction, setTransaction] =
    useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      setLoading(true);

      const response =
        await getCashTransaction(id);

      setTransaction(
        response.transaction || null
      );
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t(
            "cashTransactionDetails.failedLoad"
          )
        )
      );

      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return `${Number(
      value || 0
    ).toLocaleString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-EG"
    )} ${t("common.egp")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-EG",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const getSourceLabel = (source) => {
    switch (source) {
      case "visit_payment":
        return t(
          "cashTransactionDetails.sources.visitPayment"
        );

      case "operation_payment":
        return t(
          "cashTransactionDetails.sources.operationPayment"
        );

      case "sale_payment":
        return t(
          "cashTransactionDetails.sources.salePayment"
        );

      case "expense":
        return t(
          "cashTransactionDetails.sources.expense"
        );

      case "doctor_settlement":
        return t(
          "cashTransactionDetails.sources.doctorSettlement"
        );

      case "refund":
        return t(
          "cashTransactionDetails.sources.refund"
        );

      case "other":
        return t(
          "cashTransactionDetails.sources.other"
        );

      default:
        return source || "-";
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case "visit_payment":
        return <Stethoscope size={20} />;

      case "operation_payment":
        return <Activity size={20} />;

      case "sale_payment":
        return <ShoppingCart size={20} />;

      case "expense":
        return <Receipt size={20} />;

      case "doctor_settlement":
        return <UserRound size={20} />;

      case "refund":
        return <Wallet size={20} />;

      default:
        return <Banknote size={20} />;
    }
  };

  const getReference = () => {
    if (!transaction) {
      return "-";
    }

    if (transaction.visit) {
      return t(
        "cashTransactionDetails.visitReference",
        {
          id: transaction.visit._id?.slice(
            -6
          ),
        }
      );
    }

    if (transaction.operation) {
      return (
        transaction.operation.operationName ||
        t(
          "cashTransactionDetails.operationReference",
          {
            id: transaction.operation._id?.slice(
              -6
            ),
          }
        )
      );
    }

    if (transaction.sale) {
      return t(
        "cashTransactionDetails.saleReference",
        {
          id: transaction.sale._id?.slice(
            -6
          ),
        }
      );
    }

    return "-";
  };

  const getReferenceType = () => {
    if (!transaction) {
      return "-";
    }

    if (transaction.visit) {
      return t(
        "cashTransactionDetails.referenceTypes.visit"
      );
    }

    if (transaction.operation) {
      return t(
        "cashTransactionDetails.referenceTypes.operation"
      );
    }

    if (transaction.sale) {
      return t(
        "cashTransactionDetails.referenceTypes.sale"
      );
    }

    return "-";
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="admin-data-page">
        <div className="d-flex justify-content-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              {t("common.loading")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="admin-data-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">
              {t(
                "cashTransactionDetails.title"
              )}
            </h2>

            <p className="text-muted mb-0">
              {t(
                "cashTransactionDetails.notFound"
              )}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
            {t("common.back")}
          </button>
        </div>

        <div className="alert alert-warning">
          {t(
            "cashTransactionDetails.notFound"
          )}
        </div>
      </div>
    );
  }

  const isIncome =
    transaction.type === "income";

  const transactionFields = [
    {
      label: t(
        "cashTransactionDetails.transactionType"
      ),
      value: (
        <span
          className={`badge ${
            isIncome
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {isIncome
            ? t(
                "cashTransactionDetails.income"
              )
            : t(
                "cashTransactionDetails.expense"
              )}
        </span>
      ),
    },
    {
      label: t(
        "cashTransactionDetails.source"
      ),
      value: (
        <div className="d-flex align-items-center gap-2">
          {getSourceIcon(transaction.source)}
          <span>
            {getSourceLabel(
              transaction.source
            )}
          </span>
        </div>
      ),
    },
    {
      label: t(
        "cashTransactionDetails.amount"
      ),
      value: (
        <strong
          className={
            isIncome
              ? "text-success fs-5"
              : "text-danger fs-5"
          }
        >
          {formatMoney(transaction.amount)}
        </strong>
      ),
    },
    {
      label: t("cashTransactionDetails.date"),
      value: formatDate(
        transaction.createdAt
      ),
    },
    {
      label: t(
        "cashTransactionDetails.referenceType"
      ),
      value: getReferenceType(),
    },
    {
      label: t(
        "cashTransactionDetails.reference"
      ),
      value: getReference(),
    },
    {
      label: t("cashTransactionDetails.notes"),
      value: transaction.notes || "-",
    },
  ];

  const patientFields = transaction.patient
    ? [
        {
          label: t(
            "cashTransactionDetails.patientName"
          ),
          value:
            transaction.patient.name || "-",
        },
        {
          label: t(
            "cashTransactionDetails.phone"
          ),
          value:
            transaction.patient.phone || "-",
        },
        {
          label: t(
            "cashTransactionDetails.nationalId"
          ),
          value:
            transaction.patient.nationalId ||
            "-",
        },
        {
          label: t(
            "cashTransactionDetails.gender"
          ),
          value:
            transaction.patient.gender || "-",
        },
      ]
    : [];

  const doctorFields = transaction.doctor
    ? [
        {
          label: t(
            "cashTransactionDetails.doctorName"
          ),
          value:
            transaction.doctor.name || "-",
        },
        {
          label: t(
            "cashTransactionDetails.email"
          ),
          value:
            transaction.doctor.email || "-",
        },
      ]
    : [];

  const operationFields = transaction.operation
    ? [
        {
          label: t(
            "cashTransactionDetails.operation"
          ),
          value:
            transaction.operation
              .operationName || "-",
        },
        {
          label: t(
            "cashTransactionDetails.operationDate"
          ),
          value: formatDate(
            transaction.operation
              .operationDate
          ),
        },
        {
          label: t(
            "cashTransactionDetails.totalAmount"
          ),
          value: formatMoney(
            transaction.operation
              .totalAmount
          ),
        },
        {
          label: t(
            "cashTransactionDetails.doctorFee"
          ),
          value: formatMoney(
            transaction.operation
              .doctorFeeAmount
          ),
        },
        {
          label: t(
            "cashTransactionDetails.hospitalAmount"
          ),
          value: formatMoney(
            transaction.operation
              .hospitalAmount
          ),
        },
        {
          label: t(
            "cashTransactionDetails.paymentStatus"
          ),
          value:
            transaction.operation
              .paymentStatus || "-",
        },
        {
          label: t(
            "cashTransactionDetails.operationStatus"
          ),
          value:
            transaction.operation.status ||
            "-",
        },
      ]
    : [];

  const visitFields = transaction.visit
    ? [
        {
          label: t(
            "cashTransactionDetails.visitType"
          ),
          value:
            transaction.visit.visitType ||
            "-",
        },
        {
          label: t(
            "cashTransactionDetails.consultationFee"
          ),
          value: formatMoney(
            transaction.visit
              .consultationFee
          ),
        },
        {
          label: t(
            "cashTransactionDetails.paymentStatus"
          ),
          value:
            transaction.visit
              .paymentStatus || "-",
        },
        {
          label: t(
            "cashTransactionDetails.visitStatus"
          ),
          value:
            transaction.visit.status || "-",
        },
        {
          label: t(
            "cashTransactionDetails.visitDate"
          ),
          value: formatDate(
            transaction.visit.createdAt
          ),
        },
      ]
    : [];

  const saleFields = transaction.sale
    ? [
        {
          label: t(
            "cashTransactionDetails.saleNumber"
          ),
          value: `#${transaction.sale._id?.slice(
            -6
          )}`,
        },
        {
          label: t(
            "cashTransactionDetails.subtotal"
          ),
          value: formatMoney(
            transaction.sale.subtotal
          ),
        },
        {
          label: t(
            "cashTransactionDetails.discount"
          ),
          value: formatMoney(
            transaction.sale.discount
          ),
        },
        {
          label: t(
            "cashTransactionDetails.totalAmount"
          ),
          value: formatMoney(
            transaction.sale.totalAmount
          ),
        },
        {
          label: t(
            "cashTransactionDetails.paidAmount"
          ),
          value: formatMoney(
            transaction.sale.paidAmount
          ),
        },
        {
          label: t(
            "cashTransactionDetails.remainingAmount"
          ),
          value: formatMoney(
            transaction.sale.remainingAmount
          ),
        },
        {
          label: t(
            "cashTransactionDetails.paymentStatus"
          ),
          value:
            transaction.sale
              .paymentStatus || "-",
        },
        {
          label: t(
            "cashTransactionDetails.saleStatus"
          ),
          value:
            transaction.sale.status || "-",
        },
      ]
    : [];

  const cashDrawerFields =
    transaction.cashDrawer
      ? [
          {
            label: t(
              "cashTransactionDetails.cashDrawer"
            ),
            value: `#${transaction.cashDrawer._id?.slice(
              -6
            )}`,
          },
          {
            label: t(
              "cashTransactionDetails.openingBalance"
            ),
            value: formatMoney(
              transaction.cashDrawer
                .openingBalance
            ),
          },
          {
            label: t(
              "cashTransactionDetails.expectedCash"
            ),
            value: formatMoney(
              transaction.cashDrawer
                .expectedCash
            ),
          },
          {
            label: t(
              "cashTransactionDetails.actualCash"
            ),
            value: formatMoney(
              transaction.cashDrawer
                .actualCash
            ),
          },
          {
            label: t(
              "cashTransactionDetails.difference"
            ),
            value: formatMoney(
              transaction.cashDrawer
                .difference
            ),
          },
          {
            label: t(
              "cashTransactionDetails.drawerStatus"
            ),
            value:
              transaction.cashDrawer
                .status || "-",
          },
        ]
      : [];

  const userFields = [
    {
      label: isIncome
        ? t(
            "cashTransactionDetails.receivedBy"
          )
        : t(
            "cashTransactionDetails.createdPaidBy"
          ),
      value:
        transaction.createdBy?.name || "-",
    },
    {
      label: t(
        "cashTransactionDetails.userEmail"
      ),
      value:
        transaction.createdBy?.email || "-",
    },
    {
      label: t(
        "cashTransactionDetails.userRole"
      ),
      value:
        transaction.createdBy?.role || "-",
    },
    {
      label: t(
        "cashTransactionDetails.createdAt"
      ),
      value: formatDate(
        transaction.createdAt
      ),
    },
    {
      label: t(
        "cashTransactionDetails.updatedAt"
      ),
      value: formatDate(
        transaction.updatedAt
      ),
    },
  ];

  return (
    <div className="admin-data-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            {t(
              "cashTransactionDetails.title"
            )}
          </h2>

          <p className="text-muted mb-0">
            {getSourceLabel(
              transaction.source
            )}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
          {t("common.back")}
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className={`d-flex align-items-center justify-content-center rounded ${
                    isIncome
                      ? "bg-success-subtle text-success"
                      : "bg-danger-subtle text-danger"
                  }`}
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  {getSourceIcon(
                    transaction.source
                  )}
                </div>

                <div>
                  <div className="text-muted small">
                    {t(
                      "cashTransactionDetails.transaction"
                    )}
                  </div>

                  <h5 className="mb-0">
                    {getSourceLabel(
                      transaction.source
                    )}
                  </h5>
                </div>
              </div>

              <div
                className={`fs-3 fw-bold ${
                  isIncome
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {isIncome ? "+" : "-"}
                {formatMoney(
                  transaction.amount
                )}
              </div>

              <div className="text-muted mt-2">
                {formatDate(
                  transaction.createdAt
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <DetailsCard
            title={t(
              "cashTransactionDetails.transactionInformation"
            )}
            icon={<CreditCard size={20} />}
            fields={transactionFields}
          />
        </div>
      </div>

      {patientFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title={t(
              "cashTransactionDetails.patientInformation"
            )}
            icon={<UserRound size={20} />}
            fields={patientFields}
          />
        </div>
      )}

      {doctorFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title={t(
              "cashTransactionDetails.doctorInformation"
            )}
            icon={<UserRound size={20} />}
            fields={doctorFields}
          />
        </div>
      )}

      {operationFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title={t(
              "cashTransactionDetails.operationInformation"
            )}
            icon={<Activity size={20} />}
            fields={operationFields}
          />
        </div>
      )}

      {visitFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title={t(
              "cashTransactionDetails.visitInformation"
            )}
            icon={<Stethoscope size={20} />}
            fields={visitFields}
          />
        </div>
      )}

      {saleFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title={t(
              "cashTransactionDetails.saleInformation"
            )}
            icon={<ShoppingCart size={20} />}
            fields={saleFields}
          />
        </div>
      )}

      {cashDrawerFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title={t(
              "cashTransactionDetails.cashDrawerInformation"
            )}
            icon={<Wallet size={20} />}
            fields={cashDrawerFields}
          />
        </div>
      )}

      <div className="mb-4">
        <DetailsCard
          title={t(
            "cashTransactionDetails.systemInformation"
          )}
          icon={<FileText size={20} />}
          fields={userFields}
        />
      </div>
    </div>
  );
};

export default CashTransactionDetailsPage;