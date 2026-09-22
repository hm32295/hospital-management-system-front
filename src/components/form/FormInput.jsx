
import "./form.css";

const FormInput = ({
  formik,
  name,
  label,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete = "off",
  className = "",
  containerClassName = "",
  labelClassName = "",
  inputClassName = "",
  helpText = "",
  min,
  max,
  step,
  accept,
  multiple = false,
  rows,
  textarea = false,
  ...rest
}) => {
  const { value, onChange, onBlur } = formik.getFieldProps(name);
  const { error, touched } = formik.getFieldMeta(name);
  const hasError = touched && error;

  const isTextarea = textarea || type === "textarea";
  const isCheckbox = type === "checkbox";
  const isRadio = type === "radio";
  const isFile = type === "file";

  const handleChange = (e) => {
    if (isFile) {
      const files = e.target.files;

      formik.setFieldValue(
        name,
        multiple ? files : files?.[0] || null
      );

      return;
    }

    if (isCheckbox) {
      formik.setFieldValue(name, e.target.checked);
      return;
    }

    onChange(e);
  };

  if (isCheckbox) {
    return (
      <div className={`form-check mb-3 form-check-form-input${containerClassName}`}>
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`form-check-input ${hasError ? "is-invalid" : ""} ${inputClassName}`}
          {...rest}
        />

        {label && (
          <label
            htmlFor={name}
            className={`form-check-label ${labelClassName}`}
          >
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}

        {hasError && (
          <div className="invalid-feedback">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (isRadio) {
    return (
      <div className={`form-check mb-3 ${containerClassName}`}>
        <input
          id={name}
          name={name}
          type="radio"
          value={rest.value}
          checked={value === rest.value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`form-check-input ${hasError ? "is-invalid" : ""} ${inputClassName}`}
          {...rest}
        />

        {label && (
          <label
            htmlFor={name}
            className={`form-check-label ${labelClassName}`}
          >
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}

        {hasError && (
          <div className="invalid-feedback">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (isFile) {
    return (
      <div className={`mb-3 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={name}
            className={`form-label ${labelClassName}`}
          >
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}

        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`form-control ${hasError ? "is-invalid" : ""} ${inputClassName}`}
          {...rest}
        />

        {helpText && (
          <div className="form-text">
            {helpText}
          </div>
        )}

        {hasError && (
          <div className="invalid-feedback">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (isTextarea) {
    return (
      <div className={`mb-3 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={name}
            className={`form-label ${labelClassName}`}
          >
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}

        <textarea
          id={name}
          name={name}
          rows={rows || 4}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          className={`form-control ${hasError ? "is-invalid" : ""} ${className} ${inputClassName}`}
          {...rest}
        />

        {helpText && (
          <div className="form-text">
            {helpText}
          </div>
        )}

        {hasError && (
          <div className="invalid-feedback">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`mb-3 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={name}
          className={`form-label ${labelClassName}`}
        >
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        className={`form-control ${hasError ? "is-invalid" : ""} ${className} ${inputClassName}`}
        {...rest}
      />

      {helpText && (
        <div className="form-text">
          {helpText}
        </div>
      )}

      {hasError && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;
