
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  cancelOperation,
  getOperations,
} from "../../services/operations.service";
import { getPatients } from "../../services/patients.service";
import { getDoctors } from "../../services/doctor.service";
import { getSpecialties } from "../../services/specialty.service";
import AdminDataPage from "../../components/table/AdminDataPage";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const OperationsPage = () => {
  const { t, i18n } = useTranslation();

  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const [patientLoading, setPatientLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    patient: "",
    doctor: "",
    specialty: "",
    status: "",
    paymentStatus: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadOperations = async (
    page = pagination.page,
    currentFilters = filters
  ) => {
    try {
      setLoading(true);

      const response = await getOperations({
        ...currentFilters,
        page,
        limit: pagination.limit,
      });

      setOperations(response?.operations || []);

      setPagination(
        response?.pagination || {
          page,
          limit: pagination.limit,
          total: 0,
          pages: 0,
        }
      );
    } catch (error) {
      console.error("GET OPERATIONS ERROR:", error);

      showError(
        getApiErrorMessage(
          error,
          t("operations.loadFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperations(1);
  }, []);

  const handleFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleFiltering = () => {
    loadOperations(1, filters);
  };

  const handlePageChange = (page) => {
    loadOperations(page, filters);
  };

  const searchPatients = async (search) => {
    try {
      setPatientLoading(true);

      const response = await getPatients({
        search,
        page: 1,
        limit: 20,
      });

      const data = response?.patients || [];

      setPatients(
        data.map((patient) => ({
          value: patient._id,
          label: patient.phone
            ? `${patient.name} - ${patient.phone}`
            : patient.name,
        }))
      );
    } catch (error) {
      console.error("SEARCH PATIENTS ERROR:", error);

      showError(
        getApiErrorMessage(
          error,
          t("operations.searchPatientsFailed")
        )
      );
    } finally {
      setPatientLoading(false);
    }
  };

  const searchDoctors = async (search) => {
    try {
      setDoctorLoading(true);

      const response = await getDoctors({
        search,
        specialty: filters.specialty || "",
        page: 1,
        limit: 20,
      });

      const data = response?.doctors || [];

      setDoctors(
        data.map((doctor) => ({
          value: doctor._id,
          label: doctor.name,
        }))
      );
    } catch (error) {
      console.error("SEARCH DOCTORS ERROR:", error);

      showError(
        getApiErrorMessage(
          error,
          t("operations.searchDoctorsFailed")
        )
      );
    } finally {
      setDoctorLoading(false);
    }
  };

  const searchSpecialties = async (search) => {
    try {
      setSpecialtyLoading(true);

      const response = await getSpecialties({
        search,
        page: 1,
        limit: 20,
      });

      const data = response?.specialties || [];

      setSpecialties(
        data.map((specialty) => ({
          value: specialty._id,
          label: specialty.name,
        }))
      );
    } catch (error) {
      console.error("SEARCH SPECIALTIES ERROR:", error);

      showError(
        getApiErrorMessage(
          error,
          t("operations.searchSpecialtiesFailed")
        )
      );
    } finally {
      setSpecialtyLoading(false);
    }
  };

  const handleCancel = async (operation) => {
    const confirmed = window.confirm(
      t("operations.cancelConfirmation", {
        name: operation.operationName,
      })
    );

    if (!confirmed) return;

    try {
      const response = await cancelOperation(
        operation._id
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            t("operations.cancelFailed")
        );
      }

      showSuccess(
        response.message ||
          t("operations.cancelSuccess")
      );

      loadOperations(
        pagination.page,
        filters
      );
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("operations.cancelFailed")
        )
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-GB"
    );
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toFixed(2)} ${t(
      "common.egp"
    )}`;
  };

  const getStatusLabel = (status) => {
    return t(`operations.statuses.${status}`, {
      defaultValue: status,
    });
  };

  const getPaymentStatusLabel = (status) => {
    return t(
      `operations.paymentStatuses.${status}`,
      {
        defaultValue: status,
      }
    );
  };

  const columns = [
    {
      key: "patient",
      label: t("operations.patient"),
      render: (operation) =>
        operation.patient?.name || "-",
    },
    {
      key: "operationName",
      label: t("operations.operation"),
    },
    {
      key: "doctor",
      label: t("operations.doctor"),
      render: (operation) =>
        operation.doctor?.name || "-",
    },
    {
      key: "specialty",
      label: t("operations.specialty"),
      render: (operation) =>
        operation.specialty?.name || "-",
    },
    {
      key: "operationDate",
      label: t("operations.date"),
      render: (operation) =>
        formatDate(operation.operationDate),
    },
    {
      key: "totalAmount",
      label: t("operations.total"),
      render: (operation) =>
        formatMoney(operation.totalAmount),
    },
    {
      key: "paymentStatus",
      label: t("operations.payment"),
      render: (operation) => (
        <span
          className={`badge ${
            operation.paymentStatus === "paid"
              ? "bg-success"
              : operation.paymentStatus ===
                "partial"
              ? "bg-warning text-dark"
              : "bg-secondary"
          }`}
        >
          {getPaymentStatusLabel(
            operation.paymentStatus
          )}
        </span>
      ),
    },
    {
      key: "status",
      label: t("operations.status"),
      render: (operation) => (
        <span
          className={`badge ${
            operation.status === "completed"
              ? "bg-success"
              : operation.status ===
                "cancelled"
              ? "bg-danger"
              : "bg-warning text-dark"
          }`}
        >
          {getStatusLabel(operation.status)}
        </span>
      ),
    },
  ];

  const filterConfig = [
    {
      name: "search",
      label: t("operations.operation"),
      type: "text",
      placeholder: t("operations.searchOperation"),
      value: filters.search,
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "patient",
      label: t("operations.patient"),
      type: "searchSelect",
      options: patients,
      value: filters.patient,
      onSearch: searchPatients,
      loading: patientLoading,
      placeholder: t("operations.searchPatient"),
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "doctor",
      label: t("operations.doctor"),
      type: "searchSelect",
      options: doctors,
      value: filters.doctor,
      onSearch: searchDoctors,
      loading: doctorLoading,
      disabled: !filters.specialty,
      placeholder: filters.specialty
        ? t("operations.searchDoctor")
        : t("operations.selectSpecialtyFirst"),
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "specialty",
      label: t("operations.specialty"),
      type: "searchSelect",
      options: specialties,
      value: filters.specialty,
      onSearch: searchSpecialties,
      loading: specialtyLoading,
      placeholder: t("operations.searchSpecialty"),
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "status",
      label: t("operations.status"),
      type: "select",
      value: filters.status,
      options: [
        {
          value: "",
          label: t("operations.allStatuses"),
        },
        {
          value: "pending",
          label: t("operations.statuses.pending"),
        },
        {
          value: "completed",
          label: t("operations.statuses.completed"),
        },
        {
          value: "cancelled",
          label: t("operations.statuses.cancelled"),
        },
      ],
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "paymentStatus",
      label: t("operations.paymentStatus"),
      type: "select",
      value: filters.paymentStatus,
      options: [
        {
          value: "",
          label: t("operations.allPaymentStatuses"),
        },
        {
          value: "unpaid",
          label: t(
            "operations.paymentStatuses.unpaid"
          ),
        },
        {
          value: "partial",
          label: t(
            "operations.paymentStatuses.partial"
          ),
        },
        {
          value: "paid",
          label: t(
            "operations.paymentStatuses.paid"
          ),
        },
      ],
      col: "col-12 col-md-6 col-lg-3",
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("common.view"),
      link: (item) =>
        `/operations/${item._id}`,
    },
    {
      type: "edit",
      label: t("common.edit"),
      link: (item) =>
        `/operations/edit/${item._id}`,
      hide: (item) =>
        item.status === "cancelled",
    },
    {
      type: "cancel",
      label: t("operations.cancel"),
      onClick: handleCancel,
      hide: (item) =>
        item.status === "cancelled" ||
        Number(item.paidAmount) > 0,
    },
  ];

  return (
    <AdminDataPage
      title={t("operations.title")}
      subtitle={t("operations.subtitle")}
      type="Add"
      addLink="/operations/add"
      loading={loading}
      data={operations}
      columns={columns}
      filters={filterConfig}
      onFilter={handleFilter}
      filtering={handleFiltering}
      actions={actions}
      pagination={pagination}
      onPageChange={handlePageChange}
      emptyMessage={t("operations.noOperationsFound")}
    />
  );
};

export default OperationsPage;
