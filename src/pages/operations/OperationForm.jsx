import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOperation, updateOperation } from "../../services/operations.service";
import { getPatients } from "../../services/patients.service";
import { getDoctors } from "../../services/doctor.service";
import { getSpecialties } from "../../services/specialty.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import FormInput from "../../components/form/FormInput";
import { operationInitialValues } from "../../initialValues/operation.Initial";
import { operationSchema } from "../../schemas/operation.schema";

const OperationForm = ({
  operation = null,
  loading = false,
}) => {
  const navigate = useNavigate();

  const [patientOptions, setPatientOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);

  const [patientLoading, setPatientLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [specialtyLoading, setSpecialtyLoading] =
    useState(false);

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
              "Something went wrong"
          );
        }

        toast.success(
          response.message ||
            `Operation ${
              isEdit ? "updated" : "created"
            } successfully`
        );

        navigate(
          isEdit
            ? `/operations/${operation._id}`
            : `/operations`
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Something went wrong"
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
            label="Patient"
            required
            options={patientOptions}
            serverSearch
            onSearch={searchPatients}
            loading={patientLoading}
            placeholder="Search patient..."
          />
        </div>

        <div className="col-12 col-md-6">
          <FormSearchSelect
            formik={formik}
            name="specialty"
            label="Specialty"
            required
            options={specialtyOptions}
            serverSearch
            onSearch={searchSpecialties}
            loading={specialtyLoading}
            placeholder="Search specialty..."
          />
        </div>

        <div className="col-12 col-md-6">
          <FormSearchSelect
            formik={formik}
            name="doctor"
            label="Doctor"
            required
            options={doctorOptions}
            serverSearch
            onSearch={searchDoctors}
            loading={doctorLoading}
            placeholder={
              formik.values.specialty
                ? "Search doctor..."
                : "Select specialty first"
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
            label="Operation Name"
            required
            placeholder="Enter operation name"
          />
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="operationDate"
            label="Operation Date"
            type="date"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="cost"
            label="Cost"
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
            label="Discount"
            type="number"
            min="0"
            step="0.01"
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">
            Doctor Fee Type
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
              None
            </option>
            <option value="fixed">
              Fixed Amount
            </option>
            <option value="percentage">
              Percentage
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
                ? "Doctor Fee (%)"
                : "Doctor Fee"
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
            label="Notes"
            textarea
            placeholder="Enter notes..."
          />
        </div>

        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">
                Financial Summary
              </h6>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">
                      Total Amount
                    </small>
                    <strong>
                      {totalAmount.toFixed(2)} EGP
                    </strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">
                      Doctor Fee
                    </small>
                    <strong>
                      {doctorFeeAmount.toFixed(2)} EGP
                    </strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">
                      Hospital Amount
                    </small>
                    <strong>
                      {hospitalAmount.toFixed(2)} EGP
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
            disabled={formik.isSubmitting || loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              formik.isSubmitting || loading
            }
          >
            {formik.isSubmitting
              ? "Saving..."
              : isEdit
              ? "Update Operation"
              : "Create Operation"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OperationForm;