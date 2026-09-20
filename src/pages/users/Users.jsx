
import { useEffect, useState } from "react";
import AdminDataPage from "../../components/table/AdminDataPage";
import { deleteUser, getAllUsers } from "../../services/auth.service";
import { useTranslation } from "react-i18next";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Users = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 0,
  });
  const [filtersState, setFiltersState] = useState(null);

  const fetchUsers = async () => {
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

    setLoading(true);

    try {
      const response = await getAllUsers(params);

      setUsers(response.users || []);

      setPagination((prev) => ({
        ...prev,
        ...(response.pagination || {}),
      }));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("users.loadFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDeactivatedUser = async (id) => {
    setLoading(true);

    try {
      await deleteUser(id);

      showSuccess(t("users.deactivatedSuccess"));

      await fetchUsers();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("users.deactivateFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const filters = [
    {
      name: "search",
      label: t("users.search"),
      type: "text",
      placeholder: t("users.searchPlaceholder"),
      value: filtersState?.search,
      col: "col-12 col-md-6 col-lg-4",
    },
    {
      name: "role",
      label: t("users.role"),
      type: "select",
      value: filtersState?.role,
      col: "col-12 col-md-6 col-lg-4",
      options: [
        {
          value: "admin",
          label: "admin",
        },
        {
          value: "patient",
          label: t("users.roles.patient"),
        },
        {
          value: "doctor",
          label: "doctor",
        },
        {
          value: "pharmacy",
          label: "pharmacy",
        },
      ],
    },
    {
      name: "isActive",
      label: t("users.isActive"),
      type: "select",
      value: filtersState?.isActive,
      col: "col-12 col-md-6 col-lg-4",
      options: [
        {
          value: "undefined",
          label: t("users.all"),
        },
        {
          value: true,
          label: t("users.active"),
        },
        {
          value: false,
          label: t("users.inactive"),
        },
      ],
    },
  ];

  const handleFilter = (name, value) => {
    if (value === "undefined") {
      value = undefined;
    }

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
      label: t("users.name"),
    },
    {
      key: "email",
      label: t("users.email"),
    },
    {
      key: "role",
      label: t("users.role"),
    },
    {
      key: "isActive",
      label: t("users.status"),
      render: (user) => (
        <span
          className={`badge ${
            user.isActive
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {user.isActive
            ? t("users.active")
            : t("users.inactive")}
        </span>
      ),
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("common.view"),
      link: (user) => `/users/${user._id}`,
    },
    {
      type: "edit",
      label: t("common.edit"),
      link: (user) => `/users/edit/${user._id}`,
    },
    {
      type: "delete",
      label: t("common.delete"),
      onClick: (user) =>
        fetchDeactivatedUser(user._id),
    },
  ];

  return (
    <AdminDataPage
      title={t("users.title")}
      subtitle={t("users.subtitle")}
      loading={loading}
      columns={columns}
      data={users}
      actions={actions}
      filtering={fetchUsers}
      filters={filters}
      onFilter={handleFilter}
      pagination={pagination}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }}
    />
  );
};

export default Users;