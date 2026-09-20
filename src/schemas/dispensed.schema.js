
import * as Yup from "yup";

export const dispensedSchema = (t) =>
  Yup.object({
    reason: Yup.string(),

    patient: Yup.string(),

    patientName: Yup.string(),

    items: Yup.array()
      .of(
        Yup.object().shape({
          medicine: Yup.string().required(
            t?.("validation.medicineRequired") ||
              "medicine is required"
          ),

          quantity: Yup.string().required(
            t?.("validation.quantityRequired") ||
              "quantity is required"
          ),
        })
      )
      .min(
        1,
        t?.("validation.oneMedicineRequired") ||
          "the one medicine or more than "
      )
      .required(
        t?.("validation.atLeastOneMedicineRequired") ||
          "At least one medicine is required"
      ),
  })
  .test(
    "patient-required",
    t?.("validation.patientOrNameRequired") ||
      "Patient or patient name is required",
    function (values) {
      const hasPatient =
        values?.patient &&
        values.patient.trim() !== "";

      const hasPatientName =
        values?.patientName &&
        values.patientName.trim() !== "";

      if (!hasPatient && !hasPatientName) {
        return this.createError({
          path: "patient",
          message:
            t?.("validation.selectPatientOrEnterName") ||
            "Please select an existing patient or enter a new patient name",
        });
      }

      return true;
    }
  );
