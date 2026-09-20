
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import "./adminDataPage.css";
import Header from "../header/Header";
import FormSearchSelect from "../form/FormSearchSelect";

const AdminDataPage = ({
  title,
  subtitle,
  loading = false,
  data = [],
  columns = [],
  filters = [],
  onFilter,
  filtering,
  actions = [],
  type,
  addLink,
  pagination,
  onPageChange,
  emptyMessage,
  summary = null,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAction = (action, item, index) => {
    if (action.onClick) {
      action.onClick(item, index);
    }

    if (action.link) {
      const link =
        typeof action.link === "function"
          ? action.link(item)
          : action.link;

      navigate(link);
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case "show":
        return <Eye size={16} />;
      case "edit":
        return <Pencil size={16} />;
      case "delete":
        return <Trash2 size={16} />;
      case "cancel":
        return <X size={16} />;
      case "confirm":
        return <Check size={16} />;
      default:
        return null;
    }
  };

  const getActionClass = (type) => {
    switch (type) {
      case "show":
        return "btn-outline-primary";
      case "edit":
        return "btn-outline-warning";
      case "delete":
        return "btn-outline-danger";
      case "cancel":
        return "btn-outline-secondary";
      case "confirm":
        return "btn-outline-success";
      default:
        return "btn-outline-secondary";
    }
  };

  return (
    <div className="admin-data-page">
      <Header
        title={title}
        description={subtitle}
        buttonContent={`${type} ${title?.replace(/s$/, "")}`}
        buttonLink={addLink}
      />

      {summary?.cards?.length > 0 && (
        <div className="row g-3 mb-4">
          {summary.cards.map((card, index) => (
            <div
              key={card.key || index}
              className={
                card.col ||
                "col-12 col-sm-6 col-lg-3"
              }
            >
              <div
                className={`card h-100 ${card.className || ""}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="text-muted mb-2">
                        {card.label}
                      </div>

                      <div
                        className={`fs-4 fw-semibold ${
                          card.valueClassName || ""
                        }`}
                      >
                        {card.render
                          ? card.render(card.value, card)
                          : card.value ?? "-"}
                      </div>
                    </div>

                    {card.icon && (
                      <div
                        className={`d-flex align-items-center justify-content-center rounded ${
                          card.iconClassName ||
                          "bg-light"
                        }`}
                        style={{
                          width: "42px",
                          height: "42px",
                          flexShrink: 0,
                        }}
                      >
                        {card.icon}
                      </div>
                    )}
                  </div>

                  {card.description && (
                    <div className="text-muted small mt-2">
                      {card.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filters.length > 0 && (
        <div className="admin-data-filters">
          <div className="row g-3">
            {filters.map((filter, index) => (
              <div
                key={filter.name || index}
                className={
                  filter.col ||
                  "col-12 col-md-6 col-lg-3"
                }
              >
                {filter.type === "searchSelect" ? (
                  <FormSearchSelect
                    name={filter.name}
                    label={filter.label}
                    options={filter.options || []}
                    value={filter.value}
                    placeholder={
                      filter.placeholder ||
                      t("common.search")
                    }
                    disabled={filter.disabled}
                    isClearable={
                      filter.isClearable ?? true
                    }
                    serverSearch={
                      filter.serverSearch ?? true
                    }
                    onSearch={filter.onSearch}
                    onChange={(value) =>
                      onFilter?.(
                        filter.name,
                        value
                      )
                    }
                    loading={filter.loading}
                    debounceDelay={
                      filter.debounceDelay ?? 400
                    }
                    minSearchLength={
                      filter.minSearchLength ?? 2
                    }
                  />
                ) : filter.type === "select" ? (
                  <>
                    <label className="form-label">
                      {filter.label}
                    </label>

                    <select
                      className="form-select"
                      value={filter.value ?? ""}
                      onChange={(e) =>
                        onFilter?.(
                          filter.name,
                          e.target.value ||
                            undefined
                        )
                      }
                    >
                      {filter.options?.map(
                        (
                          option,
                          optionIndex
                        ) => (
                          <option
                            key={
                              option.value ??
                              optionIndex
                            }
                            value={
                              option.value ?? ""
                            }
                          >
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                  </>
                ) : (
                  <>
                    <label className="form-label">
                      {filter.label}
                    </label>

                    <input
                      type={
                        filter.type || "text"
                      }
                      className="form-control"
                      placeholder={
                        filter.placeholder
                      }
                      value={
                        filter.value ?? ""
                      }
                      onChange={(e) =>
                        onFilter?.(
                          filter.name,
                          e.target.value
                        )
                      }
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary d-flex text-capitalize align-items-center mt-2 justify-content-center gap-2"
            onClick={() => filtering?.()}
          >
            {t("common.filter")}
          </button>
        </div>
      )}

      <div className="admin-data-table-wrapper">
        <div className="table-responsive">
          <table className="table admin-data-table mb-0">
            <thead>
              <tr>
                <th className="text-center text-capitalize">
                  #
                </th>

                {columns.map((column, index) => (
                  <th
                    className="text-center text-capitalize"
                    key={`${index}${column.key}`}
                    style={{
                      width: column.width,
                    }}
                  >
                    {column.label}
                  </th>
                ))}

                {actions.length > 0 && (
                  <th className="text-center text-capitalize">
                    {t("common.actions")}
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (actions.length ? 1 : 0) +
                      1
                    }
                    className="admin-data-state text-center"
                  >
                    <div className="spinner-border text-primary">
                      <span className="visually-hidden">
                        {t("common.loading")}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (actions.length ? 1 : 0) +
                      1
                    }
                    className="admin-data-state text-center"
                  >
                    {emptyMessage || t("common.noData")}
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={
                      item._id ||
                      item.id ||
                      index
                    }
                  >
                    <td className="text-center">
                      {(pagination?.page
                        ? (pagination.page - 1) *
                          pagination.limit
                        : 0) +
                        index +
                        1}
                    </td>

                    {columns.map((column, i) => (
                      <td
                        key={`${i}${column.key}`}
                        className="text-center"
                      >
                        {column.render
                          ? column.render(
                              item,
                              index
                            )
                          : item[column.key] ?? "-"}
                      </td>
                    ))}

                    {actions.length > 0 && (
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          {actions.map(
                            (
                              action,
                              actionIndex
                            ) => {
                              const hidden =
                                typeof action.hide ===
                                "function"
                                  ? action.hide(
                                      item,
                                      index
                                    )
                                  : action.hide;

                              if (hidden) {
                                return null;
                              }

                              const disabled =
                                typeof action.disabled ===
                                "function"
                                  ? action.disabled(
                                      item,
                                      index
                                    )
                                  : action.disabled;

                              return (
                                <button
                                  key={
                                    actionIndex
                                  }
                                  type="button"
                                  className={`btn btn-sm ${getActionClass(
                                    action.type
                                  )}`}
                                  onClick={() =>
                                    handleAction(
                                      action,
                                      item,
                                      index
                                    )
                                  }
                                  title={
                                    action.label
                                  }
                                  disabled={
                                    disabled
                                  }
                                >
                                  {getActionIcon(
                                    action.type
                                  )}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.total > 0 && (
        <div className="admin-data-pagination">
          <div className="text-muted">
            {t("common.showing")}{" "}
            <strong>
              {(pagination.page - 1) *
                pagination.limit +
                1}
            </strong>{" "}
            -{" "}
            <strong>
              {Math.min(
                pagination.page *
                  pagination.limit,
                pagination.total
              )}
            </strong>{" "}
            {t("common.of")}{" "}
            <strong>
              {pagination.total}
            </strong>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={pagination.page === 1}
              onClick={() =>
                onPageChange?.(
                  pagination.page - 1
                )
              }
            >
              {t("common.previous")}
            </button>

            <span className="pagination-page">
              {pagination.page}
            </span>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={
                pagination.page *
                  pagination.limit >=
                pagination.total
              }
              onClick={() =>
                onPageChange?.(
                  pagination.page + 1
                )
              }
            >
              {t("common.next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDataPage;
