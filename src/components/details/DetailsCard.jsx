
import { Info } from "lucide-react";
import "./detailsCard.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getNestedValue = (object, path) => {
  if (!object || !path) {
    return undefined;
  }

  return path.split(".").reduce((current, key) => current?.[key], object);
};

const getDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const DetailsCard = ({
  data = {},
  fields = [],
  loading = false,
  emptyMessage,
}) => {
  const navigation = useNavigate();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-card">
          <div className="details-card-loading">
            <div className="details-skeleton-header">
              <div className="skeleton skeleton-icon" />
              <div className="skeleton-content">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-subtitle" />
              </div>
            </div>

            <div className="row g-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="col-12 col-md-6">
                  <div className="details-skeleton-item">
                    <div className="skeleton skeleton-label" />
                    <div className="skeleton skeleton-value" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="details-page">
        <div className="details-card">
          <div className="details-empty">
            <div className="details-empty-icon">
              <Info size={30} />
            </div>

            <h5>{t("common.noData")}</h5>

            <p>{emptyMessage || t("common.noInformationAvailable")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-card-body">
        <div className="row g-0">
          {fields.map((field, index) => {
            const value = getNestedValue(data, field.key);

            return (
              <div
                key={field.key + `${index}` || index}
                onClick={() =>
                  field?.nav ? navigation(field.nav(value, data)) : ""
                }
                className={
                  field.col
                    ? `${field.col} ${field.nav ? "cursor-pointer" : ""}`
                    : `col-12 col-md-6 ${field.nav ? "cursor-pointer" : ""}`
                }
              >
                <div className="details-item">
                  <div className="details-label">
                    {field.label}
                  </div>

                  <div className="details-value">
                    {field.render
                      ? field.render(value, data)
                      : getDisplayValue(value)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="details-card-footer">
        <div className="details-footer-info">
          <Info size={15} />
          <span>{t("common.informationUpToDate")}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailsCard;
