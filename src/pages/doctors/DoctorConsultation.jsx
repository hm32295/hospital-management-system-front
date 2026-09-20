
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import {
  ArrowLeft,
  CheckCircle,
  Trash2,
  Stethoscope,
  Plus,
} from "lucide-react";

import {
  getVisit,
  updateVisitStatus,
} from "../../services/visit.service";

import {
  getConsultationByVisit,
  completeConsultation,
} from "../../services/consultation.service";

import { getPrescriptionByConsultation } from "../../services/prescription.service";
import { getMedicines } from "../../services/medicines.service";

import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import { showError, showSuccess, showWarning } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";
import { useTranslation } from "react-i18next";

const DoctorConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [visit, setVisit] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startingVisit, setStartingVisit] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [medicineLoading, setMedicineLoading] = useState(false);
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  const dateLocale =
    i18n.language === "ar" ? "ar-EG" : "en-GB";

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const visitResponse = await getVisit(id);

      if (!visitResponse.success) {
        throw new Error(
          visitResponse.message || t("doctorConsultation.failedToLoadVisit")
        );
      }

      setVisit(visitResponse.visit);

      let consultationData = null;

      try {
        const consultationResponse =
          await getConsultationByVisit(id);

        if (consultationResponse.success) {
          consultationData = consultationResponse.consultation;
          setConsultation(consultationData);
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          throw error;
        }

        setConsultation(null);
      }

      if (consultationData?._id) {
        try {
          const prescriptionResponse =
            await getPrescriptionByConsultation(
              consultationData._id
            );

          if (prescriptionResponse.success) {
            const prescriptionData =
              prescriptionResponse.prescription;

            setPrescription(prescriptionData);

            setPrescriptionItems(
              prescriptionData.items?.map((item) => ({
                medicine:
                  item.medicine?._id || item.medicine,
                medicineName:
                  item.medicine?.name ||
                  t("doctorConsultation.medicine"),
                quantity: item.quantity || 1,
                dosage: item.dosage || "",
                frequency: item.frequency || "",
                duration: item.duration || "",
                instructions: item.instructions || "",
              })) || []
            );
          }
        } catch (error) {
          if (error.response?.status !== 404) {
            throw error;
          }

          setPrescription(null);
          setPrescriptionItems([]);
        }
      } else {
        setPrescription(null);
        setPrescriptionItems([]);
      }
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctorConsultation.failedToLoadVisit")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async () => {
    try {
      setStartingVisit(true);

      const response = await updateVisitStatus(
        id,
        "in_consultation"
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            t("doctorConsultation.failedToStart")
        );
      }

      setVisit(response.visit);

      showSuccess(
        response.message ||
          t("doctorConsultation.startedSuccessfully")
      );
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctorConsultation.failedToStart")
        )
      );
    } finally {
      setStartingVisit(false);
    }
  };

  const handleMedicineSearch = async (search) => {
    try {
      setMedicineLoading(true);

      const response = await getMedicines({ search });

      const medicines = response.medicines || [];

      const options = medicines.map((medicine) => ({
        value: medicine._id,
        label: medicine.name,
        medicine,
      }));

      setMedicineOptions(options);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctorConsultation.failedToSearchMedicines")
        )
      );
    } finally {
      setMedicineLoading(false);
    }
  };

  const addMedicine = (medicine) => {
    if (!medicine) return;

    const alreadyExists = prescriptionItems.some(
      (item) =>
        String(item.medicine) === String(medicine._id)
    );

    if (alreadyExists) {
      showWarning(
        t("doctorConsultation.medicineAlreadyAdded")
      );
      return;
    }

    setPrescriptionItems((prev) => [
      ...prev,
      {
        medicine: medicine._id,
        medicineName: medicine.name,
        quantity: 1,
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const updatePrescriptionItem = (
    index,
    field,
    value
  ) => {
    setPrescriptionItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeMedicine = (index) => {
    setPrescriptionItems((prev) =>
      prev.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  const validatePrescription = () => {
    if (prescriptionItems.length === 0) {
      return null;
    }

    for (const item of prescriptionItems) {
      if (!item.quantity || Number(item.quantity) < 1) {
        return t("doctorConsultation.invalidQuantity", {
          medicine: item.medicineName,
        });
      }

      if (!item.dosage?.trim()) {
        return t("doctorConsultation.dosageRequired", {
          medicine: item.medicineName,
        });
      }

      if (!item.frequency?.trim()) {
        return t("doctorConsultation.frequencyRequired", {
          medicine: item.medicineName,
        });
      }

      if (!item.duration?.trim()) {
        return t("doctorConsultation.durationRequired", {
          medicine: item.medicineName,
        });
      }
    }

    return null;
  };

  const handleSubmit = async (values) => {
    try {
      if (!visit) return;

      if (visit.status !== "in_consultation") {
        showWarning(
          t("doctorConsultation.visitMustBeInConsultation")
        );
        return;
      }

      const prescriptionError = validatePrescription();

      if (prescriptionError) {
        showError(prescriptionError);
        return;
      }

      setSaving(true);

      const response = await completeConsultation({
        visit: visit._id,
        symptoms: values.symptoms?.trim() || null,
        diagnosis: values.diagnosis?.trim() || null,
        notes: values.notes?.trim() || null,
        items: prescriptionItems.map((item) => ({
          medicine: item.medicine,
          quantity: Number(item.quantity),
          dosage: item.dosage.trim(),
          frequency: item.frequency.trim(),
          duration: item.duration.trim(),
          instructions:
            item.instructions?.trim() || null,
        })),
        prescriptionNotes:
          values.notes?.trim() || null,
      });

      if (!response.success) {
        throw new Error(
          response.message ||
            t("doctorConsultation.failedToComplete")
        );
      }

      setVisit((prev) => ({
        ...prev,
        status: "completed",
        completedAt:
          response.visit?.completedAt || new Date(),
      }));

      setConsultation(response.consultation || null);
      setPrescription(response.prescription || null);

      if (response.prescription) {
        setPrescriptionItems(
          response.prescription.items?.map((item) => ({
            medicine:
              item.medicine?._id || item.medicine,
            medicineName:
              item.medicine?.name ||
              t("doctorConsultation.medicine"),
            quantity: item.quantity || 1,
            dosage: item.dosage || "",
            frequency: item.frequency || "",
            duration: item.duration || "",
            instructions: item.instructions || "",
          })) || []
        );
      } else {
        setPrescriptionItems([]);
      }

      showSuccess(
        response.prescription
          ? t("doctorConsultation.completedWithPrescription")
          : t("doctorConsultation.completedSuccessfully")
      );
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctorConsultation.failedToComplete")
        )
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          role="status"
        />
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="container-fluid py-3">
        <div className="alert alert-danger">
          {t("doctorConsultation.visitNotFound")}
        </div>
      </div>
    );
  }

  const initialValues = {
    symptoms: consultation?.symptoms || "",
    diagnosis: consultation?.diagnosis || "",
    notes: consultation?.notes || "",
  };

  const isEditable = visit.status === "in_consultation";
  const isCompleted = visit.status === "completed";
  const isCancelled = visit.status === "cancelled";

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            type="button"
            className="btn btn-light mb-2"
            onClick={() => navigate("/visits")}
          >
            <ArrowLeft size={18} className="me-2" />
            {t("common.back")}
          </button>

          <h3 className="mb-1">
            <Stethoscope size={26} className="me-2" />
            {t("doctorConsultation.title")}
          </h3>

          <p className="text-muted mb-0">
            {t("doctorConsultation.description")}
          </p>
        </div>

        <div>
          {visit.status === "waiting" && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={startingVisit}
              onClick={handleStartConsultation}
            >
              {startingVisit
                ? t("doctorConsultation.starting")
                : t("doctorConsultation.start")}
            </button>
          )}

          {visit.status === "in_consultation" && (
            <span className="badge bg-primary fs-6">
              {t("doctorConsultation.inConsultation")}
            </span>
          )}

          {visit.status === "completed" && (
            <span className="badge bg-success fs-6">
              {t("doctorConsultation.completed")}
            </span>
          )}

          {visit.status === "cancelled" && (
            <span className="badge bg-danger fs-6">
              {t("doctorConsultation.cancelled")}
            </span>
          )}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                {t("doctorConsultation.visitInformation")}
              </h5>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  {t("doctorConsultation.patient")}
                </small>

                <div className="fw-semibold">
                  {visit.patient?.name ||
                    t("doctorConsultation.walkIn")}
                </div>

                {visit.patient?.phone && (
                  <small className="text-muted">
                    {visit.patient.phone}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  {t("doctorConsultation.specialty")}
                </small>

                <div className="fw-semibold">
                  {visit.specialty?.name || "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  {t("doctorConsultation.doctor")}
                </small>

                <div className="fw-semibold">
                  {visit.doctor?.name || "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  {t("doctorConsultation.visitType")}
                </small>

                <div>
                  <span className="badge bg-info">
                    {visit.visitType === "first"
                      ? t("doctorConsultation.firstVisit")
                      : t("doctorConsultation.followUp")}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  {t("doctorConsultation.consultationFee")}
                </small>

                <div className="fw-semibold">
                  {visit.consultationFee}{" "}
                  {t("common.egp")}
                </div>
              </div>

              <div>
                <small className="text-muted">
                  {t("doctorConsultation.paymentStatus")}
                </small>

                <div className="mt-1">
                  {visit.paymentStatus === "paid" && (
                    <span className="badge bg-success">
                      {t("doctorConsultation.paid")}
                    </span>
                  )}

                  {visit.paymentStatus === "pending" && (
                    <span className="badge bg-warning text-dark">
                      {t("doctorConsultation.pending")}
                    </span>
                  )}

                  {visit.paymentStatus === "cancelled" && (
                    <span className="badge bg-danger">
                      {t("doctorConsultation.cancelled")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form>
                <div className="card shadow-sm mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      {t("doctorConsultation.consultation")}
                    </h5>
                  </div>

                  <div className="card-body">
                    <fieldset
                      disabled={
                        !isEditable ||
                        saving ||
                        isCancelled
                      }
                    >
                      <FormInput
                        formik={formik}
                        name="symptoms"
                        label={t("doctorConsultation.symptoms")}
                        placeholder={t(
                          "doctorConsultation.symptomsPlaceholder"
                        )}
                        textarea
                        rows={4}
                      />

                      <FormInput
                        formik={formik}
                        name="diagnosis"
                        label={t("doctorConsultation.diagnosis")}
                        placeholder={t(
                          "doctorConsultation.diagnosisPlaceholder"
                        )}
                        textarea
                        rows={4}
                      />

                      <FormInput
                        formik={formik}
                        name="notes"
                        label={t("doctorConsultation.notes")}
                        placeholder={t(
                          "doctorConsultation.notesPlaceholder"
                        )}
                        textarea
                        rows={4}
                      />
                    </fieldset>
                  </div>
                </div>

                <div className="card shadow-sm mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      {t("doctorConsultation.prescription")}
                    </h5>

                    <span className="badge bg-primary">
                      {prescriptionItems.length}{" "}
                      {t("doctorConsultation.medicines")}
                    </span>
                  </div>

                  <div className="card-body">
                    <fieldset
                      disabled={
                        !isEditable ||
                        saving ||
                        isCancelled
                      }
                    >
                      <FormSearchSelect
                        label={t("doctorConsultation.addMedicine")}
                        placeholder={t(
                          "doctorConsultation.searchMedicine"
                        )}
                        options={medicineOptions}
                        serverSearch
                        onSearch={handleMedicineSearch}
                        loading={medicineLoading}
                        isClearable
                        onChange={(value, option) => {
                          if (option?.medicine) {
                            addMedicine(option.medicine);
                          }
                        }}
                      />

                      {prescriptionItems.length === 0 && (
                        <div className="alert alert-light border text-center">
                          <Plus
                            size={18}
                            className="me-2"
                          />
                          {t(
                            "doctorConsultation.noPrescriptionMedicines"
                          )}
                        </div>
                      )}

                      {prescriptionItems.map((item, index) => (
                        <div
                          key={`${item.medicine}-${index}`}
                          className="border rounded p-3 mb-3"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">
                              {item.medicineName}
                            </h6>

                            {isEditable && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  removeMedicine(index)
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>

                          <div className="row">
                            <div className="col-md-3">
                              <label className="form-label">
                                {t("doctorConsultation.quantity")}
                              </label>

                              <input
                                type="number"
                                min="1"
                                className="form-control"
                                value={item.quantity}
                                disabled={
                                  !isEditable || saving
                                }
                                onChange={(e) =>
                                  updatePrescriptionItem(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="col-md-9">
                              <label className="form-label">
                                {t("doctorConsultation.dosage")}
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                placeholder={t(
                                  "doctorConsultation.dosagePlaceholder"
                                )}
                                value={item.dosage}
                                disabled={
                                  !isEditable || saving
                                }
                                onChange={(e) =>
                                  updatePrescriptionItem(
                                    index,
                                    "dosage",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="col-md-6 mt-3">
                              <label className="form-label">
                                {t("doctorConsultation.frequency")}
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                placeholder={t(
                                  "doctorConsultation.frequencyPlaceholder"
                                )}
                                value={item.frequency}
                                disabled={
                                  !isEditable || saving
                                }
                                onChange={(e) =>
                                  updatePrescriptionItem(
                                    index,
                                    "frequency",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="col-md-6 mt-3">
                              <label className="form-label">
                                {t("doctorConsultation.duration")}
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                placeholder={t(
                                  "doctorConsultation.durationPlaceholder"
                                )}
                                value={item.duration}
                                disabled={
                                  !isEditable || saving
                                }
                                onChange={(e) =>
                                  updatePrescriptionItem(
                                    index,
                                    "duration",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="col-12 mt-3">
                              <label className="form-label">
                                {t("doctorConsultation.instructions")}
                              </label>

                              <textarea
                                className="form-control"
                                rows="2"
                                placeholder={t(
                                  "doctorConsultation.instructionsPlaceholder"
                                )}
                                value={item.instructions}
                                disabled={
                                  !isEditable || saving
                                }
                                onChange={(e) =>
                                  updatePrescriptionItem(
                                    index,
                                    "instructions",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {isEditable && (
                        <button
                          type="submit"
                          className="btn btn-success w-100"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              />
                              {t("doctorConsultation.saving")}
                            </>
                          ) : (
                            <>
                              <CheckCircle
                                size={18}
                                className="me-2"
                              />
                              {t("doctorConsultation.saveConsultation")}
                              {prescriptionItems.length > 0 &&
                                ` ${t(
                                  "doctorConsultation.andPrescription"
                                )}`}
                            </>
                          )}
                        </button>
                      )}

                      {isCompleted && (
                        <div className="alert alert-success mb-0">
                          <CheckCircle
                            size={18}
                            className="me-2"
                          />
                          {t(
                            "doctorConsultation.consultationCompleted"
                          )}
                        </div>
                      )}

                      {isCancelled && (
                        <div className="alert alert-danger mb-0">
                          {t(
                            "doctorConsultation.visitCancelled"
                          )}
                        </div>
                      )}
                    </fieldset>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultation;
