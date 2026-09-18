
import { useState } from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import {createVisit} from "../../services/visit.service";
import { getPatients } from "../../services/patients.service";
import { getSpecialties } from "../../services/specialty.service";
import { getDoctors } from "../../services/doctor.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import NewPatientForm from "../../components/newPatientForm/NewPatientForm";
import { createVisitPayment } from "../../services/payment.service";

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

  const [registeredVisit, setRegisteredVisit] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] =
    useState(false);

  const formik = useFormik({
    initialValues: {
      patient: "",
      specialty: "",
      doctor: "",
    },
    onSubmit: async (values) => {
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

        setRegisteredVisit(visit);
        setPaymentAmount(
          Number(visit.consultationFee || 0)
        );
        setPaymentNotes("");

        enqueueSnackbar(
          `Visit registered successfully - ${
            visit.visitType === "first"
              ? "First Visit"
              : "Follow Up"
          } - ${visit.consultationFee} EGP`,
          {
            variant: "success",
          }
        );
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

const handlePayment = async () => {
  const amount = Number(paymentAmount || 0);
  const totalAmount = Number(
    registeredVisit?.consultationFee || 0
  );

  if (!amount || amount <= 0) {
    enqueueSnackbar(
      "Please enter a valid payment amount",
      {
        variant: "error",
      }
    );
    return;
  }

  if (amount > totalAmount) {
    enqueueSnackbar(
      "Payment amount cannot exceed the consultation fee",
      {
        variant: "error",
      }
    );
    return;
  }

  try {
    setPaymentSubmitting(true);

    const response = await createVisitPayment(
      registeredVisit._id,
      {
        amount,
        notes: paymentNotes.trim(),
      }
    );

    if (!response.success) {
      throw new Error(
        response.message ||
          "Failed to create visit payment"
      );
    }

    enqueueSnackbar(
      `Payment completed successfully - ${amount} EGP`,
      {
        variant: "success",
      }
    );

    const paidAmount = Number(amount);

    const remainingAmount = Math.max(
      totalAmount - paidAmount,
      0
    );

    setRegisteredVisit((prev) => ({
      ...prev,
      paidAmount,
      remainingAmount,
      paymentStatus:
        remainingAmount === 0
          ? "paid"
          : "partial",
    }));

    setPaymentAmount(
      remainingAmount > 0
        ? remainingAmount
        : ""
    );

    setPaymentNotes("");
  } catch (error) {
    enqueueSnackbar(
      error.response?.data?.message ||
        error.message ||
        "Failed to create payment",
      {
        variant: "error",
      }
    );
  } finally {
    setPaymentSubmitting(false);
  }
};

  const handleNewReception = () => {
    formik.resetForm();

    setPatientOptions([]);
    setSpecialtyOptions([]);
    setDoctorOptions([]);

    setRegisteredVisit(null);
    setPaymentAmount("");
    setPaymentNotes("");
    setShowNewPatient(false);
  };

  const totalAmount = Number(
    registeredVisit?.consultationFee || 0
  );

  const paidAmount = Number(
    registeredVisit?.paidAmount || 0
  );

  const remainingAmount =
    registeredVisit?.remainingAmount !== undefined
      ? Number(registeredVisit.remainingAmount)
      : Math.max(totalAmount - paidAmount, 0);

  const isPaid =
    registeredVisit?.paymentStatus === "paid" ||
    remainingAmount === 0;

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="mb-1">Reception</h3>
        <p className="text-muted mb-0">
          Register patient visit and collect payment
        </p>
      </div>

      {!registeredVisit ? (
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
                onCancel={() =>
                  setShowNewPatient(false)
                }
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
                determined automatically by the server
                based on the patient's visit history.
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
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">
                      Visit Registered
                    </h5>

                    <small className="text-muted">
                      Payment can be completed now
                    </small>
                  </div>

                  <span
                    className={`badge ${
                      isPaid
                        ? "bg-success"
                        : registeredVisit.paymentStatus ===
                          "partial"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {isPaid
                      ? "Paid"
                      : registeredVisit.paymentStatus ===
                        "partial"
                      ? "Partial"
                      : "Unpaid"}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small">
                        Visit Type
                      </div>

                      <div className="fw-semibold mt-1">
                        {registeredVisit.visitType ===
                        "first"
                          ? "First Visit"
                          : "Follow Up"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small">
                        Consultation Fee
                      </div>

                      <div className="fw-semibold mt-1">
                        {totalAmount.toFixed(2)} EGP
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small">
                        Paid
                      </div>

                      <div className="fw-semibold text-success mt-1">
                        {paidAmount.toFixed(2)} EGP
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small">
                        Remaining
                      </div>

                      <div className="fw-semibold text-danger mt-1">
                        {remainingAmount.toFixed(2)} EGP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isPaid && (
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0">
                    Collect Payment
                  </h5>
                </div>

                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Payment Amount
                    </label>

                    <input
                      type="number"
                      min="0"
                      max={remainingAmount}
                      step="0.01"
                      className="form-control form-control-lg"
                      value={paymentAmount}
                      onChange={(e) =>
                        setPaymentAmount(
                          e.target.value
                        )
                      }
                    />

                    <div className="small text-muted mt-1">
                      Remaining:{" "}
                      {remainingAmount.toFixed(2)} EGP
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Notes
                    </label>

                    <textarea
                      className="form-control"
                      rows="3"
                      value={paymentNotes}
                      onChange={(e) =>
                        setPaymentNotes(
                          e.target.value
                        )
                      }
                      placeholder="Optional notes..."
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-success w-100"
                    onClick={handlePayment}
                    disabled={paymentSubmitting}
                  >
                    {paymentSubmitting
                      ? "Processing Payment..."
                      : `Pay ${Number(
                          paymentAmount || 0
                        ).toFixed(2)} EGP`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isPaid && (
            <div className="col-12">
              <div className="alert alert-success d-flex justify-content-between align-items-center mb-0">
                <div>
                  <strong>Payment Completed</strong>
                  <div className="small mt-1">
                    The consultation has been fully paid.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={handleNewReception}
                >
                  New Reception
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reception;