
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getDoctors,
  deactivateDoctor,
} from "../../services/doctor.service";
import {
  showError,
  showSuccess,
} from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";
import AdminDataPage from "../../components/table/AdminDataPage";

const Doctors = () => {
  const { t, i18n } = useTranslation();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await getDoctors({
        search: search.trim(),
        page,
        limit: 10,
      });

      setDoctors(response.doctors || []);

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
          t("doctors.failedLoadDoctors")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, page]);

  const handleFilter = (name, value) => {
    if (name === "search") {
      setSearch(value || "");
      setPage(1);
    }
  };

  const handleDelete = async (doctor) => {
    const confirmed = window.confirm(
      t("doctors.confirmDeactivate", {
        name: doctor.name,
      })
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await deactivateDoctor(
        doctor._id
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            t("doctors.failedDeactivate")
        );
      }

      showSuccess(
        t("doctors.deactivatedSuccess")
      );

      if (
        doctors.length === 1 &&
        page > 1
      ) {
        setPage((prev) => prev - 1);
      } else {
        await fetchDoctors();
      }
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctors.failedDeactivate")
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
      label: t("doctors.doctor"),
      render: (doctor) => (
        <span className="fw-semibold">
          {doctor.name || "-"}
        </span>
      ),
    },
    {
      key: "specialties",
      label: t("doctors.specialties"),
      render: (doctor) =>
        doctor.specialties?.length ? (
          <div className="d-flex flex-wrap gap-1 justify-content-center">
            {doctor.specialties.map(
              (specialty) => (
                <span
                  key={specialty._id}
                  className="badge text-bg-light border"
                >
                  {specialty.name}
                </span>
              )
            )}
          </div>
        ) : (
          "-"
        ),
    },
    {
      key: "phone",
      label: t("doctors.phone"),
      render: (doctor) =>
        doctor.phone || "-",
    },
    {
      key: "earned",
      label: t("doctors.earned"),
      render: (doctor) => (
        <span>
          {formatMoney(
            doctor.account?.earned
          )}{" "}
          {t("common.egp")}
        </span>
      ),
    },
    {
      key: "paid",
      label: t("doctors.paid"),
      render: (doctor) => (
        <span className="text-success fw-semibold">
          {formatMoney(
            doctor.account?.paid
          )}{" "}
          {t("common.egp")}
        </span>
      ),
    },
    {
      key: "due",
      label: t("doctors.due"),
      render: (doctor) => (
        <span className="text-danger fw-semibold">
          {formatMoney(
            doctor.account?.due
          )}{" "}
          {t("common.egp")}
        </span>
      ),
    },
  ];

  const filters = [
    {
      name: "search",
      label: t("doctors.searchDoctors"),
      type: "text",
      placeholder: t(
        "doctors.searchDoctorsPlaceholder"
      ),
      value: search,
      col: "col-12 col-md-6 col-lg-4",
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("doctors.doctorAccount"),
      link: (doctor) =>
        `/doctors/${doctor._id}`,
    },
    {
      type: "edit",
      label: t("doctors.editDoctor"),
      link: (doctor) =>
        `/doctors/edit/${doctor._id}`,
    },
    {
      type: "delete",
      label: t("doctors.deactivateDoctor"),
      onClick: handleDelete,
    },
  ];

  return (
    <AdminDataPage
      title={t("doctors.title")}
      subtitle={t("doctors.subtitle")}
      type="Add"
      addLink="/doctors/add"
      loading={loading}
      data={doctors}
      columns={columns}
      filters={filters}
      onFilter={handleFilter}
      filtering={fetchDoctors}
      actions={actions}
      pagination={pagination}
      onPageChange={setPage}
      emptyMessage={t(
        "doctors.noDoctorsFound"
      )}
    />
  );
};

export default Doctors;
