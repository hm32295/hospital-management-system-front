
import { useEffect, useRef, useState } from "react";
import Select from "react-select";

const FormSearchSelect = ({
  formik,
  name,
  label,
  options = [],
  placeholder = "Search...",
  required = false,
  disabled = false,
  isClearable = true,
  isMulti = false,
  serverSearch = false,
  onSearch,
  onChange,
  value: externalValue,
  loading = false,
  debounceDelay = 400,
  minSearchLength = 2,
}) => {
  const isFormik = !!formik;

  const formikValue = isFormik
    ? formik.getFieldProps(name).value
    : externalValue;

  const formikMeta = isFormik
    ? formik.getFieldMeta(name)
    : { error: "", touched: false };

  const { error, touched } = formikMeta;
  const hasError = touched && error;

  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(
    isMulti ? [] : null
  );

  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (!serverSearch || !onSearchRef.current) return;

    const search = searchValue.trim();

    if (search.length < minSearchLength) return;

    const timer = setTimeout(() => {
      onSearchRef.current(search);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [
    searchValue,
    serverSearch,
    debounceDelay,
    minSearchLength,
  ]);

  useEffect(() => {
    if (isMulti) {
      const values = Array.isArray(formikValue)
        ? formikValue
        : [];

      const selected = options.filter((option) =>
        values.some(
          (value) => String(value) === String(option.value)
        )
      );

      setSelectedOption(selected);
      return;
    }

    if (!formikValue) {
      setSelectedOption(null);
      return;
    }

    const option = options.find(
      (option) =>
        String(option.value) === String(formikValue)
    );

    setSelectedOption(option || null);
  }, [formikValue, options, isMulti]);

  const handleChange = (selected) => {
    if (isMulti) {
      const selectedOptions = selected || [];

      const values = selectedOptions.map(
        (option) => option.value
      );

      setSelectedOption(selectedOptions);

      if (isFormik) {
        formik.setFieldValue(name, values);
      }

      onChange?.(values, selectedOptions);

      return;
    }

    const value = selected?.value ?? "";

    setSelectedOption(selected || null);

    if (isFormik) {
      formik.setFieldValue(name, value);
    }

    onChange?.(value, selected);
  };

  const handleBlur = () => {
    if (isFormik) {
      formik.setFieldTouched(name, true);
    }
  };

  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === "input-change") {
      setSearchValue(inputValue);
    }

    return inputValue;
  };

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label">
          {label}

          {required && (
            <span className="text-danger ms-1">
              *
            </span>
          )}
        </label>
      )}

      <Select
        options={options}
        value={selectedOption}
        placeholder={placeholder}
        isSearchable
        isMulti={isMulti}
        isClearable={isClearable}
        isDisabled={disabled}
        isLoading={loading}
        onChange={handleChange}
        onBlur={handleBlur}
        onInputChange={handleInputChange}
        classNamePrefix="form-select"
        className={hasError ? "is-invalid" : ""}
        filterOption={
          serverSearch
            ? () => true
            : undefined
        }
        noOptionsMessage={() => {
          if (loading) {
            return "Loading...";
          }

          if (
            serverSearch &&
            searchValue.trim().length < minSearchLength
          ) {
            return `Type at least ${minSearchLength} characters`;
          }

          return searchValue
            ? "No results found"
            : "No options found";
        }}
      />

      {hasError && (
        <div className="text-danger small mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default FormSearchSelect;
