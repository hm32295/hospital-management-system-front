import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { cancelOperation, getOperations } from "../../services/operations.service";
import { getPatients } from "../../services/patients.service";
import { getDoctors } from "../../services/doctor.service";
import { getSpecialties } from "../../services/specialty.service";
import AdminDataPage from "../../components/table/AdminDataPage";


const OperationsPage = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const [patientLoading, setPatientLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [specialtyLoading, setSpecialtyLoading] =
    useState(false);

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
      console.error(
        "GET OPERATIONS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load operations"
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
      console.error(
        "SEARCH PATIENTS ERROR:",
        error
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
      console.error(
        "SEARCH DOCTORS ERROR:",
        error
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

      const data =
        response?.specialties || [];

      setSpecialties(
        data.map((specialty) => ({
          value: specialty._id,
          label: specialty.name,
        }))
      );
    } catch (error) {
      console.error(
        "SEARCH SPECIALTIES ERROR:",
        error
      );
    } finally {
      setSpecialtyLoading(false);
    }
  };

  const handleCancel = async (operation) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel "${operation.operationName}"?`
    );

    if (!confirmed) return;

    try {
      const response = await cancelOperation(
        operation._id
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to cancel operation"
        );
      }

      toast.success(
        response.message ||
          "Operation cancelled successfully"
      );

      loadOperations(
        pagination.page,
        filters
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to cancel operation"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-GB"
    );
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toFixed(2)} EGP`;
  };

  const columns = [
    {
      key: "patient",
      label: "Patient",
      render: (operation) =>
        operation.patient?.name || "-",
    },
    {
      key: "operationName",
      label: "Operation",
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (operation) =>
        operation.doctor?.name || "-",
    },
    {
      key: "specialty",
      label: "Specialty",
      render: (operation) =>
        operation.specialty?.name || "-",
    },
    {
      key: "operationDate",
      label: "Date",
      render: (operation) =>
        formatDate(operation.operationDate),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (operation) =>
        formatMoney(operation.totalAmount),
    },
    {
      key: "paymentStatus",
      label: "Payment",
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
          {operation.paymentStatus}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
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
          {operation.status}
        </span>
      ),
    },
  ];

  const filterConfig = [
    {
      name: "search",
      label: "Operation",
      type: "text",
      placeholder: "Search operation...",
      value: filters.search,
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "patient",
      label: "Patient",
      type: "searchSelect",
      options: patients,
      value: filters.patient,
      onSearch: searchPatients,
      loading: patientLoading,
      placeholder: "Search patient...",
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "doctor",
      label: "Doctor",
      type: "searchSelect",
      options: doctors,
      value: filters.doctor,
      onSearch: searchDoctors,
      loading: doctorLoading,
      disabled: !filters.specialty,
      placeholder: filters.specialty
        ? "Search doctor..."
        : "Select specialty first",
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "specialty",
      label: "Specialty",
      type: "searchSelect",
      options: specialties,
      value: filters.specialty,
      onSearch: searchSpecialties,
      loading: specialtyLoading,
      placeholder: "Search specialty...",
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      value: filters.status,
      options: [
        {
          value: "",
          label: "All Statuses",
        },
        {
          value: "pending",
          label: "Pending",
        },
        {
          value: "completed",
          label: "Completed",
        },
        {
          value: "cancelled",
          label: "Cancelled",
        },
      ],
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      value: filters.paymentStatus,
      options: [
        {
          value: "",
          label: "All Payment Statuses",
        },
        {
          value: "unpaid",
          label: "Unpaid",
        },
        {
          value: "partial",
          label: "Partial",
        },
        {
          value: "paid",
          label: "Paid",
        },
      ],
      col: "col-12 col-md-6 col-lg-3",
    },
  ];

  const actions = [
    {
      type: "show",
      label: "View",
      link: (item) =>
        `/operations/${item._id}`,
    },
    {
      type: "edit",
      label: "Edit",
      link: (item) =>
        `/operations/edit/${item._id}`,
      hide: (item) =>
        item.status === "cancelled",
    },
    {
      type: "cancel",
      label: "Cancel",
      onClick: handleCancel,
      hide: (item) =>
        item.status === "cancelled" ||
        Number(item.paidAmount) > 0,
    },
  ];

  return (
    <AdminDataPage
      title="Operations"
      subtitle="Manage hospital operations"
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
      emptyMessage="No operations found"
    />
  );
};

export default OperationsPage;