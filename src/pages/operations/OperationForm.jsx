
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  createOperation,
  updateOperation,
} from "../../services/operations.service";
import { getPatients } from "../../services/patients.service";
import { getDoctors } from "../../services/doctor.service";
import { getSpecialties } from "../../services/specialty.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import FormInput from "../../components/form/FormInput";
import { operationInitialValues } from "../../initialValues/operation.Initial";
import { operationSchema } from "../../schemas/operation.schema";
import {
  showError,
  showSuccess,
} from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const OperationForm = ({
  operation = null,
  loading = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [patientOptions, setPatientOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);

  const [patientLoading, setPatientLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);

  const isEdit = Boolean(operation?._id);

  const formik = useFormik({
    initialValues: operation
      ? {
          patient:
            operation.patient?._id ||
            operation.patient ||
            "",
          doctor:
            operation.doctor?._id ||
            operation.doctor ||
            "",
          specialty:
            operation.specialty?._id ||
            operation.specialty ||
            "",
          operationName:
            operation.operationName || "",
          operationDate: operation.operationDate
            ? new Date(operation.operationDate)
                .toISOString()
                .split("T")[0]
            : "",
          cost: operation.cost ?? "",
          discount: operation.discount ?? 0,
          doctorFeeType:
            operation.doctorFeeType || "none",
          doctorFeeValue:
            operation.doctorFeeValue ?? 0,
          notes: operation.notes || "",
        }
      : operationInitialValues,
    validationSchema: operationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          patient: values.patient,
          doctor: values.doctor,
          specialty: values.specialty,
          operationName: values.operationName,
          operationDate: values.operationDate,
          cost: Number(values.cost),
          discount: Number(values.discount || 0),
          doctorFeeType: values.doctorFeeType,
          doctorFeeValue: Number(
            values.doctorFeeValue || 0
          ),
          notes: values.notes || "",
        };

        let response;

        if (isEdit) {
          response = await updateOperation(
            operation._id,
            payload
          );
        } else {
          response = await createOperation(payload);
        }

        if (!response?.success) {
          throw new Error(
            response?.message ||
              t("operations.saveFailed")
          );
        }

        showSuccess(
          response.message ||
            (isEdit
              ? t("operations.updateSuccess")
              : t("operations.createSuccess"))
        );

        navigate(
          isEdit
            ? `/operations/${operation._id}`
            : `/operations`
        );
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("operations.saveFailed")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const searchPatients = async (search) => {
    try {
      setPatientLoading(true);

      const response = await getPatients({
        search,
        page: 1,
        limit: 20,
      });

      const patients = response?.patients || [];

      setPatientOptions(
        patients.map((patient) => ({
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

      showError(
        getApiErrorMessage(
          error,
          t("operations.searchPatientsFailed")
        )
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
        specialty: formik.values.specialty || "",
        page: 1,
        limit: 20,
      });

      const doctors = response?.doctors || [];

      setDoctorOptions(
        doctors.map((doctor) => ({
          value: doctor._id,
          label: doctor.name,
        }))
      );
    } catch (error) {
      console.error(
        "SEARCH DOCTORS ERROR:",
        error
      );

      showError(
        getApiErrorMessage(
          error,
          t("operations.searchDoctorsFailed")
        )
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

      const specialties =
        response?.specialties || [];

      setSpecialtyOptions(
        specialties.map((specialty) => ({
          value: specialty._id,
          label: specialty.name,
        }))
      );
    } catch (error) {
      console.error(
        "SEARCH SPECIALTIES ERROR:",
        error
      );

      showError(
        getApiErrorMessage(
          error,
          t("operations.searchSpecialtiesFailed")
        )
      );
    } finally {
      setSpecialtyLoading(false);
    }
  };

  useEffect(() => {
    if (!formik.values.specialty) {
      setDoctorOptions([]);
      formik.setFieldValue("doctor", "");
    }
  }, [formik.values.specialty]);

  useEffect(() => {
    if (
      formik.values.specialty &&
      formik.values.doctor
    ) {
      setDoctorOptions([]);
    }
  }, [formik.values.specialty]);

  const cost = Number(formik.values.cost || 0);
  const discount = Number(
    formik.values.discount || 0
  );

  const totalAmount = Math.max(
    cost - discount,
    0
  );

  const doctorFeeValue = Number(
    formik.values.doctorFeeValue || 0
  );

  let doctorFeeAmount = 0;

  if (
    formik.values.doctorFeeType === "fixed"
  ) {
    doctorFeeAmount = doctorFeeValue;
  }

  if (
    formik.values.doctorFeeType ===
    "percentage"
  ) {
    doctorFeeAmount =
      (totalAmount * doctorFeeValue) / 100;
  }

  const hospitalAmount = Math.max(
    totalAmount - doctorFeeAmount,
    0
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <FormSearchSelect
            formik={formik}
            name="patient"
            label={t("operations.patient")}
            required
            options={patientOptions}
            serverSearch
            onSearch={searchPatients}
            loading={patientLoading}
            placeholder={t("operations.searchPatient")}
          />
        </div>

        <div className="col-12 col-md-6">
          <FormSearchSelect
            formik={formik}
            name="specialty"
            label={t("operations.specialty")}
            required
            options={specialtyOptions}
            serverSearch
            onSearch={searchSpecialties}
            loading={specialtyLoading}
            placeholder={t(
              "operations.searchSpecialty"
            )}
          />
        </div>

        <div className="col-12 col-md-6">
          <FormSearchSelect
            formik={formik}
            name="doctor"
            label={t("operations.doctor")}
            required
            options={doctorOptions}
            serverSearch
            onSearch={searchDoctors}
            loading={doctorLoading}
            placeholder={
              formik.values.specialty
                ? t("operations.searchDoctor")
                : t(
                    "operations.selectSpecialtyFirst"
                  )
            }
            disabled={
              !formik.values.specialty
            }
          />
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="operationName"
            label={t("operations.operationName")}
            required
            placeholder={t(
              "operations.operationNamePlaceholder"
            )}
          />
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="operationDate"
            label={t("operations.operationDate")}
            type="date"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="cost"
            label={t("operations.cost")}
            type="number"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="discount"
            label={t("operations.discount")}
            type="number"
            min="0"
            step="0.01"
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">
            {t("operations.doctorFeeType")}
          </label>

          <select
            className={`form-select ${
              formik.touched.doctorFeeType &&
              formik.errors.doctorFeeType
                ? "is-invalid"
                : ""
            }`}
            name="doctorFeeType"
            value={formik.values.doctorFeeType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="none">
              {t("operations.feeTypes.none")}
            </option>

            <option value="fixed">
              {t("operations.feeTypes.fixedAmount")}
            </option>

            <option value="percentage">
              {t("operations.feeTypes.percentage")}
            </option>
          </select>

          {formik.touched.doctorFeeType &&
            formik.errors.doctorFeeType && (
              <div className="invalid-feedback">
                {formik.errors.doctorFeeType}
              </div>
            )}
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="doctorFeeValue"
            label={
              formik.values.doctorFeeType ===
              "percentage"
                ? t(
                    "operations.doctorFeePercentage"
                  )
                : t(
                    "operations.doctorFee"
                  )
            }
            type="number"
            min="0"
            max={
              formik.values.doctorFeeType ===
              "percentage"
                ? "100"
                : undefined
            }
            step="0.01"
            disabled={
              formik.values.doctorFeeType ===
              "none"
            }
          />
        </div>

        <div className="col-12">
          <FormInput
            formik={formik}
            name="notes"
            label={t("operations.notes")}
            textarea
            placeholder={t(
              "operations.notesPlaceholder"
            )}
          />
        </div>

        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">
                {t("operations.financialSummary")}
              </h6>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">
                      {t("operations.totalAmount")}
                    </small>

                    <strong>
                      {totalAmount.toFixed(2)}{" "}
                      {t("common.egp")}
                    </strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">
                      {t("operations.doctorFee")}
                    </small>

                    <strong>
                      {doctorFeeAmount.toFixed(2)}{" "}
                      {t("common.egp")}
                    </strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">
                      {t(
                        "operations.hospitalAmount"
                      )}
                    </small>

                    <strong>
                      {hospitalAmount.toFixed(2)}{" "}
                      {t("common.egp")}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={
              formik.isSubmitting || loading
            }
          >
            {t("common.cancel")}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              formik.isSubmitting || loading
            }
          >
            {formik.isSubmitting
              ? t("operations.saving")
              : isEdit
              ? t("operations.updateOperation")
              : t("operations.createOperation")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OperationForm;
