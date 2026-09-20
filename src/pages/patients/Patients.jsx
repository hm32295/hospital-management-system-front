
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getPatients,
  deactivatePatient,
} from "../../services/patients.service";
import AdminDataPage from "../../components/table/AdminDataPage";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Patients = () => {
  const { t, i18n } = useTranslation();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await getPatients({
        search: search.trim(),
        page,
        limit: 10,
      });

      setPatients(response.patients || []);

      setPagination(
        response.pagination || {
          page,
          limit: 10,
          total: 0,
          pages: 0,
        }
      );
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("patients.failedLoad")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, page]);

  const handleFilter = (name, value) => {
    if (name === "search") {
      setSearch(value || "");
      setPage(1);
    }
  };

  const handleDelete = async (patient) => {
    const confirmed = window.confirm(
      t("patients.deactivateConfirmation", {
        name: patient.name,
      })
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await deactivatePatient(
        patient._id
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            t("patients.deactivateFailed")
        );
      }

      showSuccess(
        response.message ||
          t("patients.deactivateSuccess")
      );

      if (patients.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchPatients();
      }
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("patients.deactivateFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-EG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  const columns = [
    {
      key: "name",
      label: t("patients.patient"),
      render: (patient) => (
        <div>
          <div className="fw-semibold">
            {patient.name || "-"}
          </div>

          {patient.email && (
            <div className="text-muted small">
              {patient.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "phone",
      label: t("patients.phone"),
      render: (patient) =>
        patient.phone || "-",
    },
    {
      key: "gender",
      label: t("patients.gender"),
      render: (patient) => {
        if (patient.gender === "male") {
          return (
            <span className="badge text-bg-primary">
              {t("patients.genders.male")}
            </span>
          );
        }

        if (patient.gender === "female") {
          return (
            <span className="badge text-bg-danger">
              {t("patients.genders.female")}
            </span>
          );
        }

        return "-";
      },
    },
    {
      key: "charges",
      label: t("patients.charges"),
      render: (patient) => (
        <span>
          {formatMoney(
            patient.account?.charges
          )}{" "}
          {t("common.egp")}
        </span>
      ),
    },
    {
      key: "paid",
      label: t("patients.paid"),
      render: (patient) => (
        <span className="text-success fw-semibold">
          {formatMoney(
            patient.account?.paid
          )}{" "}
          {t("common.egp")}
        </span>
      ),
    },
    {
      key: "due",
      label: t("patients.due"),
      render: (patient) => (
        <span className="text-danger fw-semibold">
          {formatMoney(
            patient.account?.due
          )}{" "}
          {t("common.egp")}
        </span>
      ),
    },
  ];

  const filters = [
    {
      name: "search",
      label: t("patients.searchPatients"),
      type: "text",
      placeholder: t(
        "patients.searchPlaceholder"
      ),
      value: search,
      col: "col-12 col-md-6 col-lg-4",
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("patients.patientDetails"),
      link: (patient) =>
        `/patients/${patient._id}`,
    },
    {
      type: "edit",
      label: t("patients.editPatient"),
      link: (patient) =>
        `/patients/edit/${patient._id}`,
    },
    {
      type: "delete",
      label: t("patients.deactivatePatient"),
      onClick: handleDelete,
    },
  ];

  return (
    <AdminDataPage
      title={t("patients.title")}
      subtitle={t("patients.subtitle")}
      type="Add"
      typeContent ={t('patients.typeContent')}
      addLink="/patients/add"
      loading={loading}
      data={patients}
      columns={columns}
      filters={filters}
      onFilter={handleFilter}
      filtering={fetchPatients}
      actions={actions}
      pagination={pagination}
      onPageChange={setPage}
      emptyMessage={t("patients.noPatientsFound")}
    />
  );
};

export default Patients;