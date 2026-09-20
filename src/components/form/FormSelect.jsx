
import { useTranslation } from "react-i18next";

const FormSelect = ({
  formik,
  name,
  label,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  className = "",
}) => {
  const { t } = useTranslation();

  const error =
    formik.touched[name] &&
    formik.errors[name];

  return (
    <div className="mb-3">
      {label && (
        <label
          htmlFor={name}
          className="form-label"
        >
          {label}

          {required && (
            <span className="text-danger ms-1">
              *
            </span>
          )}
        </label>
      )}

      <select
        id={name}
        name={name}
        disabled={disabled}
        value={formik.values[name] ?? ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`form-select ${
          error ? "is-invalid" : ""
        } ${className}`}
      >
        <option value="">
          {placeholder || t("common.select")}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="invalid-feedback">
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
};

export default FormSelect;
