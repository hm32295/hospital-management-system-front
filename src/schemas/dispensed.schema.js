import * as Yup from "yup";
export const dispensedSchema = Yup.object({
    reason: Yup.string(),
    patient: Yup.string(),
    patientName: Yup.string(),
    items: Yup.array().of(
        Yup.object().shape({
            medicine:Yup.string()
                .required("medicine is required"),
            quantity:Yup.string()
                .required("quantity is required"),
        })
    ).min(1, 'the one medicine or more than ')
    .required("At least one medicine is required"),
  

}).test("patient-required","Patient or patient name is required",
  function (values) {
    const hasPatient = values?.patient &&values.patient.trim() !== "";
    const hasPatientName = values?.patientName && values.patientName.trim() !== "";

    if (!hasPatient && !hasPatientName) {
      return this.createError({
        path: "patient",
        message:
          "Please select an existing patient or enter a new patient name",
      });
    }

    return true;
  }
);
 