
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminDataPage from "../../components/table/AdminDataPage";
import { deleteMedicine, getMedicines } from "../../services/medicines.service";
import { getCategory } from "../../services/category.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Medicines = () => {
  const { t, i18n } = useTranslation();
  const [medicines, setMedicines] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtersState, setFiltersState] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });


  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = filtersState
        ? {
            page: pagination.page,
            limit: pagination.limit,
            ...filtersState,
          }
        : {
            page: pagination.page,
            limit: pagination.limit,
          };

      const response = await getMedicines(params);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
      setMedicines(response.medicines);
    } catch (error) {
      showError(getApiErrorMessage(error, t("medicines.failedLoad")));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await getCategory();
      setCategory(
        response.categories.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }))
      );
    } catch (error) {
      showError(getApiErrorMessage(error, t("medicines.failedLoadCategories")));
    } finally {
      setLoading(false);
    }
  };

  const fetchDeactivatedMedicine = async (id) => {
    setLoading(true);
    try {
      await deleteMedicine(id);
      showSuccess(t("medicines.deactivatedSuccess"));
      fetchMedicines();
    } catch (error) {
      showError(getApiErrorMessage(error, t("medicines.deactivateFailed")));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchMedicinesPage = async () => {
      setLoading(true);
      try {
        const params = filtersState
          ? {
              page: pagination.page,
              limit: pagination.limit,
              ...filtersState,
            }
          : {
              page: pagination.page,
              limit: pagination.limit,
            };

        const response = await getMedicines(params);
        setMedicines(response.medicines);
      } catch (error) {
        showError(getApiErrorMessage(error, t("medicines.failedLoad")));
      } finally {
        setLoading(false);
      }
    };

    fetchMedicinesPage();
  }, [pagination]);

  const filters = [
    {
      name: "search",
      label: t("medicines.search"),
      type: "text",
      placeholder: t("medicines.searchMedicine"),
      value: filtersState?.search,
      col: "col-12 col-md-6 col-lg-4",
    },
    {
      name: "manufacturer",
      label: t("medicines.manufacturer"),
      type: "text",
      placeholder: t("medicines.manufacturerPlaceholder"),
      value: filtersState?.manufacturer,
      col: "col-12 col-md-6 col-lg-3",
    },
    {
      name: "category",
      label: t("medicines.category"),
      type: "select",
      value: filtersState?.category,
      col: "col-12 col-md-6 col-lg-3",
      options: [
        {
          value: "undefined",
          label: t("medicines.all"),
        },
        ...category,
      ],
    },
    {
      name: "isActive",
      label: t("medicines.status"),
      type: "select",
      value: filtersState?.isActive,
      options: [
        {
          value: "undefined",
          label: t("medicines.all"),
        },
        {
          value: "true",
          label: t("medicines.statuses.active"),
        },
        {
          value: "false",
          label: t("medicines.statuses.inactive"),
        },
      ],
      col: "col-12 col-md-6 col-lg-2",
    },
  ];

  const handleFilter = (name, value) => {
    value === "undefined" ? (value = undefined) : (value = value);
    setFiltersState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const columns = [
    {
      key: "name",
      label: t("medicines.medicine"),
      render: (medicine)=> medicine.name.split("",15).join("")
      
    },
    {
      key: "genericName",
      label: t("medicines.genericName"),
      render: (medicine)=> medicine.genericName.split("",15).join("")
    },
    {
      key: "manufacturer",
      label: t("medicines.manufacturer"),
      render: (medicines)=> medicines.manufacturer.split("",15).join("")
    },
    {
      key: "category",
      label: t("medicines.category"),
      render: (medicine) => (
        <span>{medicine?.category?.name}</span>
      ),
    },
    {
      key: "isActive",
      label: t("medicines.status"),
      render: (medicine) => (
        <span
          className={`badge ${
            medicine.isActive
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {medicine.isActive
            ? t("medicines.statuses.active")
            : t("medicines.statuses.inactive")}
        </span>
      ),
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("common.view"),
      link: (medicine) => `/medicines/${medicine._id}`,
    },
    {
      type: "edit",
      label: t("common.edit"),
      link: (medicine) => `/medicines/edit/${medicine._id}`,
    },
    {
      type: "delete",
      label: t("common.delete"),
      onClick: (medicine) =>
        fetchDeactivatedMedicine(medicine._id),
    },
  ];

  return (
    <AdminDataPage
      title={t("medicines.title")}
      subtitle={t("medicines.subtitle")}
      loading={loading}
      filters={filters}
      columns={columns}
      type="add"
      typeContent={t('common.typeContent')}
      addLink="/add-medicine"
      data={medicines}
      onFilter={handleFilter}
      actions={actions}
      pagination={pagination}
      filtering={fetchMedicines}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }}
    />
  );
};

export default Medicines;