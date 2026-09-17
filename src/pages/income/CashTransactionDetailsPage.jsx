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

import DetailsCard from "../../components/details/DetailsCard";
import {
  getCashTransaction,
} from "../../services/cashTransactions.service";

const CashTransactionDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [transaction, setTransaction] =
    useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      setLoading(true);

      const response =await getCashTransaction(id);
        console.log(response);
        
      setTransaction(response.transaction || null);
    } catch (error) {
      console.error(
        "Failed to load cash transaction:",
        error
      );

      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString(
      "en-EG"
    )} EGP`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getSourceLabel = (source) => {
    switch (source) {
      case "visit_payment":
        return "Visit Payment";

      case "operation_payment":
        return "Operation Payment";

      case "sale_payment":
        return "Sale Payment";

      case "expense":
        return "General Expense";

      case "doctor_settlement":
        return "Doctor Settlement";

      case "refund":
        return "Refund";

      case "other":
        return "Other";

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
      return `Visit #${transaction.visit._id?.slice(
        -6
      )}`;
    }

    if (transaction.operation) {
      return (
        transaction.operation.operationName ||
        `Operation #${transaction.operation._id?.slice(
          -6
        )}`
      );
    }

    if (transaction.sale) {
      return `Sale #${transaction.sale._id?.slice(
        -6
      )}`;
    }

    return "-";
  };

  const getReferenceType = () => {
    if (!transaction) {
      return "-";
    }

    if (transaction.visit) {
      return "Visit";
    }

    if (transaction.operation) {
      return "Operation";
    }

    if (transaction.sale) {
      return "Sale";
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
          <div className="spinner-border text-primary">
            <span className="visually-hidden">
              Loading...
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
              Transaction Details
            </h2>

            <p className="text-muted mb-0">
              Cash transaction not found
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        <div className="alert alert-warning">
          Cash transaction not found.
        </div>
      </div>
    );
  }

  const isIncome =
    transaction.type === "income";

  const transactionFields = [
    {
      label: "Transaction Type",
      value: (
        <span
          className={`badge ${
            isIncome
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {isIncome ? "Income" : "Expense"}
        </span>
      ),
    },

    {
      label: "Source",
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
      label: "Amount",
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
      label: "Date",
      value: formatDate(
        transaction.createdAt
      ),
    },

    {
      label: "Reference Type",
      value: getReferenceType(),
    },

    {
      label: "Reference",
      value: getReference(),
    },

    {
      label: "Notes",
      value: transaction.notes || "-",
    },
  ];

  const patientFields = transaction.patient
    ? [
        {
          label: "Patient Name",
          value:
            transaction.patient.name || "-",
        },

        {
          label: "Phone",
          value:
            transaction.patient.phone || "-",
        },

        {
          label: "National ID",
          value:
            transaction.patient.nationalId ||
            "-",
        },

        {
          label: "Gender",
          value:
            transaction.patient.gender || "-",
        },
      ]
    : [];

  const doctorFields = transaction.doctor
    ? [
        {
          label: "Doctor Name",
          value:
            transaction.doctor.name || "-",
        },

        {
          label: "Email",
          value:
            transaction.doctor.email || "-",
        },
      ]
    : [];

  const operationFields = transaction.operation
    ? [
        {
          label: "Operation",
          value:
            transaction.operation
              .operationName || "-",
        },

        {
          label: "Operation Date",
          value: formatDate(
            transaction.operation
              .operationDate
          ),
        },

        {
          label: "Total Amount",
          value: formatMoney(
            transaction.operation
              .totalAmount
          ),
        },

        {
          label: "Doctor Fee",
          value: formatMoney(
            transaction.operation
              .doctorFeeAmount
          ),
        },

        {
          label: "Hospital Amount",
          value: formatMoney(
            transaction.operation
              .hospitalAmount
          ),
        },

        {
          label: "Payment Status",
          value:
            transaction.operation
              .paymentStatus || "-",
        },

        {
          label: "Operation Status",
          value:
            transaction.operation.status ||
            "-",
        },
      ]
    : [];

  const visitFields = transaction.visit
    ? [
        {
          label: "Visit Type",
          value:
            transaction.visit.visitType ||
            "-",
        },

        {
          label: "Consultation Fee",
          value: formatMoney(
            transaction.visit
              .consultationFee
          ),
        },

        {
          label: "Payment Status",
          value:
            transaction.visit
              .paymentStatus || "-",
        },

        {
          label: "Visit Status",
          value:
            transaction.visit.status || "-",
        },

        {
          label: "Visit Date",
          value: formatDate(
            transaction.visit.createdAt
          ),
        },
      ]
    : [];

  const saleFields = transaction.sale
    ? [
        {
          label: "Sale Number",
          value: `#${transaction.sale._id?.slice(
            -6
          )}`,
        },

        {
          label: "Subtotal",
          value: formatMoney(
            transaction.sale.subtotal
          ),
        },

        {
          label: "Discount",
          value: formatMoney(
            transaction.sale.discount
          ),
        },

        {
          label: "Total Amount",
          value: formatMoney(
            transaction.sale.totalAmount
          ),
        },

        {
          label: "Paid Amount",
          value: formatMoney(
            transaction.sale.paidAmount
          ),
        },

        {
          label: "Remaining Amount",
          value: formatMoney(
            transaction.sale
              .remainingAmount
          ),
        },

        {
          label: "Payment Status",
          value:
            transaction.sale
              .paymentStatus || "-",
        },

        {
          label: "Sale Status",
          value:
            transaction.sale.status || "-",
        },
      ]
    : [];

  const cashDrawerFields =
    transaction.cashDrawer
      ? [
          {
            label: "Cash Drawer",
            value: `#${transaction.cashDrawer._id?.slice(
              -6
            )}`,
          },

          {
            label: "Opening Balance",
            value: formatMoney(
              transaction.cashDrawer
                .openingBalance
            ),
          },

          {
            label: "Expected Cash",
            value: formatMoney(
              transaction.cashDrawer
                .expectedCash
            ),
          },

          {
            label: "Actual Cash",
            value: formatMoney(
              transaction.cashDrawer
                .actualCash
            ),
          },

          {
            label: "Difference",
            value: formatMoney(
              transaction.cashDrawer
                .difference
            ),
          },

          {
            label: "Drawer Status",
            value:
              transaction.cashDrawer
                .status || "-",
          },
        ]
      : [];

  const userFields = [
    {
      label: isIncome
        ? "Received By"
        : "Created / Paid By",

      value:
        transaction.createdBy?.name || "-",
    },

    {
      label: "User Email",
      value:
        transaction.createdBy?.email || "-",
    },

    {
      label: "User Role",
      value:
        transaction.createdBy?.role || "-",
    },

    {
      label: "Created At",
      value: formatDate(
        transaction.createdAt
      ),
    },

    {
      label: "Updated At",
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
            Transaction Details
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
          Back
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
                    Transaction
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
            title="Transaction Information"
            icon={<CreditCard size={20} />}
            fields={transactionFields}
          />
        </div>
      </div>

      {patientFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title="Patient Information"
            icon={<UserRound size={20} />}
            fields={patientFields}
          />
        </div>
      )}

      {doctorFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title="Doctor Information"
            icon={<UserRound size={20} />}
            fields={doctorFields}
          />
        </div>
      )}

      {operationFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title="Operation Information"
            icon={<Activity size={20} />}
            fields={operationFields}
          />
        </div>
      )}

      {visitFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title="Visit Information"
            icon={<Stethoscope size={20} />}
            fields={visitFields}
          />
        </div>
      )}

      {saleFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title="Sale Information"
            icon={<ShoppingCart size={20} />}
            fields={saleFields}
          />
        </div>
      )}

      {cashDrawerFields.length > 0 && (
        <div className="mb-4">
          <DetailsCard
            title="Cash Drawer Information"
            icon={<Wallet size={20} />}
            fields={cashDrawerFields}
          />
        </div>
      )}

      <div className="mb-4">
        <DetailsCard
          title="System Information"
          icon={<FileText size={20} />}
          fields={userFields}
        />
      </div>
    </div>
  );
};

export default CashTransactionDetailsPage;