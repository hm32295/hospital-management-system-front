import { useState } from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { createVisit } from "../../services/visit.service";
import { getPatients } from "../../services/patients.service";
import { getSpecialties } from "../../services/specialty.service";
import { getDoctors } from "../../services/doctor.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import NewPatientForm from "../../components/newPatientForm/NewPatientForm";

const Reception = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [patientOptions, setPatientOptions] = useState([]);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);

  const [patientLoading, setPatientLoading] = useState(false);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);

  const [showNewPatient, setShowNewPatient] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      patient: "",
      specialty: "",
      doctor: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);

        const response = await createVisit({
          patient: values.patient || null,
          specialty: values.specialty,
          doctor: values.doctor || null,
        });

        if (!response.success) {
          throw new Error(
            response.message || "Failed to create visit"
          );
        }

        const visit = response.visit;

        enqueueSnackbar(
          `Visit registered successfully - ${visit.visitType === "first" ? "First Visit" : "Follow Up"} - ${visit.consultationFee} EGP`,
          {
            variant: "success",
          }
        );

        resetForm();

        setPatientOptions([]);
        setSpecialtyOptions([]);
        setDoctorOptions([]);
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message ||
            error.message ||
            "Failed to register visit",
          {
            variant: "error",
          }
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchPatients = async (search) => {
    try {
      setPatientLoading(true);

      const response = await getPatients({
        search,
        page: 1,
        limit: 10,
      });

      const patients = response.patients || [];

      setPatientOptions(
        patients.map((patient) => ({
          value: patient._id,
          label: `${patient.name}${
            patient.phone ? ` - ${patient.phone}` : ""
          }`,
        }))
      );
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to search patients",
        {
          variant: "error",
        }
      );
    } finally {
      setPatientLoading(false);
    }
  };

  const fetchSpecialties = async (search) => {
    try {
      setSpecialtyLoading(true);

      const response = await getSpecialties({
        search,
        page: 1,
        limit: 10,
      });

      const specialties = response.specialties || [];

      setSpecialtyOptions(
        specialties.map((specialty) => ({
          value: specialty._id,
          label: specialty.name,
        }))
      );
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to search specialties",
        {
          variant: "error",
        }
      );
    } finally {
      setSpecialtyLoading(false);
    }
  };

  const fetchDoctors = async (search) => {
    if (!formik.values.specialty) return;

    try {
      setDoctorLoading(true);

      const response = await getDoctors({
        search,
        specialty: formik.values.specialty,
        page: 1,
        limit: 10,
      });

      const doctors = response.doctors || [];

      setDoctorOptions(
        doctors.map((doctor) => ({
          value: doctor._id,
          label: doctor.name,
        }))
      );
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to search doctors",
        {
          variant: "error",
        }
      );
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleSpecialtyChange = (value) => {
    formik.setFieldValue("specialty", value);
    formik.setFieldValue("doctor", "");
    setDoctorOptions([]);
  };

  const handlePatientCreated = (patient) => {
    const patientOption = {
      value: patient._id,
      label: `${patient.name}${
        patient.phone ? ` - ${patient.phone}` : ""
      }`,
    };

    setPatientOptions([patientOption]);

    formik.setFieldValue("patient", patient._id);

    setShowNewPatient(false);
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="mb-1">Reception</h3>
        <p className="text-muted mb-0">
          Register a patient visit
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-md-8">
              <FormSearchSelect
                formik={formik}
                name="patient"
                label="Patient"
                placeholder="Search patient by name, phone or national ID..."
                options={patientOptions}
                serverSearch
                onSearch={fetchPatients}
                loading={patientLoading}
                minSearchLength={2}
                debounceDelay={400}
              />
            </div>

            <div className="col-md-4 d-flex align-items-end mb-3">
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() =>
                  setShowNewPatient((prev) => !prev)
                }
              >
                {showNewPatient
                  ? "Cancel"
                  : "+ New Patient"}
              </button>
            </div>
          </div>

          {showNewPatient && (
            <NewPatientForm
              onPatientCreated={handlePatientCreated}
              onCancel={() => setShowNewPatient(false)}
            />
          )}

          <div className="row">
            <div className="col-md-6">
              <FormSearchSelect
                formik={formik}
                name="specialty"
                label="Specialty"
                placeholder="Search specialty..."
                options={specialtyOptions}
                serverSearch
                onSearch={fetchSpecialties}
                onChange={handleSpecialtyChange}
                loading={specialtyLoading}
                minSearchLength={2}
                debounceDelay={400}
                required
              />
            </div>

            <div className="col-md-6">
              <FormSearchSelect
                formik={formik}
                name="doctor"
                label="Doctor"
                placeholder={
                  formik.values.specialty
                    ? "Search doctor..."
                    : "Select specialty first"
                }
                options={doctorOptions}
                serverSearch
                onSearch={fetchDoctors}
                loading={doctorLoading}
                disabled={!formik.values.specialty}
                minSearchLength={2}
                debounceDelay={400}
              />
            </div>
          </div>

          <div className="alert alert-info mt-3">
            <strong>Consultation Fee</strong>

            <div className="small mt-1">
              The visit type and consultation fee are
              determined automatically by the server based
              on the patient's visit history.
            </div>

            <div className="small mt-2">
              <span className="fw-semibold">
                First Visit:
              </span>{" "}
              70 EGP
              {" | "}
              <span className="fw-semibold">
                Follow Up:
              </span>{" "}
              30 EGP
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btn btn-primary px-4"
              onClick={formik.submitForm}
              disabled={
                submitting ||
                !formik.values.specialty
              }
            >
              {submitting
                ? "Registering..."
                : "Register Visit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reception;