
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import { getCurrentUser } from "../../services/auth.service";
import { useTranslation } from "react-i18next";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const SingleUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const response = await getCurrentUser(id);

        setUser(response.user);
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

    if (id) {
      fetchUser();
    }
  }, [id]);

  const userFields = [
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
      render: (value) => (
        <span
          className={`badge ${
            value
              ? "text-bg-success"
              : "text-bg-danger"
          }`}
        >
          {value
            ? t("users.active")
            : t("users.inactive")}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: t("users.createdAt"),
      render: (value) =>
        value
          ? new Date(value).toLocaleString(
              i18n.language === "ar"
                ? "ar-EG"
                : "en-GB"
            )
          : "-",
    },
    {
      key: "updatedAt",
      label: t("users.updatedAt"),
      render: (value) =>
        value
          ? new Date(value).toLocaleString(
              i18n.language === "ar"
                ? "ar-EG"
                : "en-GB"
            )
          : "-",
    },
  ];

  return (
    <div className="container-fluid">
      <Header
        buttonContent={t("users.backToUsers")}
        buttonLink="/users"
        title={t("users.userDetails")}
      />

      <DetailsCard
        title={t("users.userInformation")}
        data={user}
        fields={userFields}
        loading={loading}
        emptyMessage={t("users.notFound")}
      />
    </div>
  );
};

export default SingleUser;