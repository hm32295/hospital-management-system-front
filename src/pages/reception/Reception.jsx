
import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { createVisit } from "../../services/visit.service";
import { getPatients } from "../../services/patients.service";
import { getSpecialties } from "../../services/specialty.service";
import { getDoctors } from "../../services/doctor.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import NewPatientForm from "../../components/newPatientForm/NewPatientForm";
import { createVisitPayment } from "../../services/payment.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";
import FormInput from "../../components/form/FormInput";

const Reception = () => {
  const { t } = useTranslation();

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
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      patient: "",
      specialty: "",
      doctor: "",
      firstVisit : false
    },
    onSubmit: async (values) => {
      console.log(values);
      
      try {
        setSubmitting(true);

        const response = await createVisit({
          firstVisit : values.firstVisit || false,
          patient: values.patient || null,
          specialty: values.specialty,
          doctor: values.doctor || null,
        });

        if (!response.success) {
          throw new Error(
            response.message || t("reception.createVisitFailed")
          );
        }

        const visit = response.visit;

        setRegisteredVisit(visit);
        setPaymentAmount(Number(visit.consultationFee || 0));
        setPaymentNotes("");

        showSuccess(
          `${t("reception.visitRegisteredSuccessfully")} - ${
            visit.visitType === "first"
              ? t("reception.firstVisit")
              : t("reception.followUp")
          } - ${visit.consultationFee} ${t("common.egp")}`
        );
      } catch (error) {
        showError(
          getApiErrorMessage(error, t("reception.registerVisitFailed"))
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
      showError(
        getApiErrorMessage(error, t("reception.searchPatientsFailed"))
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
      showError(
        getApiErrorMessage(error, t("reception.searchSpecialtiesFailed"))
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
      showError(
        getApiErrorMessage(error, t("reception.searchDoctorsFailed"))
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
      showError(t("reception.invalidPaymentAmount"));
      return;
    }

    if (amount > totalAmount) {
      showError(t("reception.paymentExceedsFee"));
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
          response.message || t("reception.createPaymentFailed")
        );
      }

      showSuccess(
        `${t("reception.paymentCompletedSuccessfully")} - ${amount} ${t(
          "common.egp"
        )}`
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
      showError(
        getApiErrorMessage(error, t("reception.createPaymentFailed"))
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
        <h3 className="mb-1">{t("reception.title")}</h3>
        <p className="text-muted mb-0">
          {t("reception.description")}
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
                  label={t("reception.patient")}
                  placeholder={t("reception.patientPlaceholder")}
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
                    ? t("common.cancel")
                    : `+ ${t("reception.newPatient")}`}
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
                  label={t("reception.specialty")}
                  placeholder={t("reception.specialtyPlaceholder")}
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
                  label={t("reception.doctor")}
                  placeholder={
                    formik.values.specialty
                      ? t("reception.doctorPlaceholder")
                      : t("reception.selectSpecialtyFirst")
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

              {/*     display: flex;
    justify-content: flex-start;
    gap: .5rem;
    align-items: center;
    cursor: pointer;
    width: fit-content; */}
              <div className="col-md-6">
                <FormInput
                  type="checkbox"
                  name='firstVisit'
                  label='زيارة أولى'
                  formik={formik}
                  className=""
                />
              </div>
            </div>


            <div className="alert alert-info mt-3">
              <strong>{t("reception.consultationFee")}</strong>

              <div className="small mt-1">
                {t("reception.consultationFeeDescription")}
              </div>

              <div className="small mt-2">
                <span className="fw-semibold">
                  {t("reception.firstVisit")}:
                </span>{" "}
                70 {t("common.egp")}
                {" | "}
                <span className="fw-semibold">
                  {t("reception.followUp")}:
                </span>{" "}
                30 {t("common.egp")}
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
                  ? t("reception.registering")
                  : t("reception.registerVisit")}
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
                      {t("reception.visitRegistered")}
                    </h5>

                    <small className="text-muted">
                      {t("reception.paymentCanBeCompleted")}
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
                      ? t("reception.paid")
                      : registeredVisit.paymentStatus ===
                        "partial"
                      ? t("reception.partial")
                      : t("reception.unpaid")}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small">
                        {t("reception.visitType")}
                      </div>

                      <div className="fw-semibold mt-1">
                        {registeredVisit.visitType ===
                        "first"
                          ? t("reception.firstVisit")
                          : t("reception.followUp")}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small">
                        {t("reception.consultationFee")}
                      </div>

                      <div className="fw-semibold mt-1">
                        {totalAmount.toFixed(2)}{" "}
                        {t("common.egp")}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small">
                        {t("reception.paid")}
                      </div>

                      <div className="fw-semibold text-success mt-1">
                        {paidAmount.toFixed(2)}{" "}
                        {t("common.egp")}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small">
                        {t("reception.remaining")}
                      </div>

                      <div className="fw-semibold text-danger mt-1">
                        {remainingAmount.toFixed(2)}{" "}
                        {t("common.egp")}
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
                    {t("reception.collectPayment")}
                  </h5>
                </div>

                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">
                      {t("reception.paymentAmount")}
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
                      {t("reception.remaining")}:{" "}
                      {remainingAmount.toFixed(2)}{" "}
                      {t("common.egp")}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {t("reception.notes")}
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
                      placeholder={t(
                        "reception.notesPlaceholder"
                      )}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-success w-100"
                    onClick={handlePayment}
                    disabled={paymentSubmitting}
                  >
                    {paymentSubmitting
                      ? t("reception.processingPayment")
                      : `${t("reception.pay")} ${Number(
                          paymentAmount || 0
                        ).toFixed(2)} ${t("common.egp")}`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isPaid && (
            <div className="col-12">
              <div className="alert alert-success d-flex justify-content-between align-items-center mb-0">
                <div>
                  <strong>
                    {t("reception.paymentCompleted")}
                  </strong>
                  <div className="small mt-1">
                    {t("reception.consultationFullyPaid")}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={handleNewReception}
                >
                  {t("reception.newReception")}
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
