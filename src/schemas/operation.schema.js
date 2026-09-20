import * as Yup from "yup";

export const operationSchema = (t) =>
  Yup.object({
    patient: Yup.string().required(
      t?.("validation.patientRequired") ||
        "Patient is required"
    ),

    doctor: Yup.string().required(
      t?.("validation.doctorRequired") ||
        "Doctor is required"
    ),

    specialty: Yup.string().required(
      t?.("validation.specialtyRequired") ||
        "Specialty is required"
    ),

    operationName: Yup.string()
      .required(
        t?.("validation.operationNameRequired") ||
          "Operation name is required"
      )
      .max(
        200,
        t?.("validation.operationNameMax") ||
          "Operation name cannot exceed 200 characters"
      ),

    operationDate: Yup.date()
      .required(
        t?.("validation.operationDateRequired") ||
          "Operation date is required"
      )
      .typeError(
        t?.("validation.invalidOperationDate") ||
          "Invalid operation date"
      ),

    cost: Yup.number()
      .required(
        t?.("validation.costRequired") ||
          "Cost is required"
      )
      .min(
        0,
        t?.("validation.costNegative") ||
          "Cost cannot be negative"
      ),

    discount: Yup.number().min(
      0,
      t?.("validation.discountNegative") ||
        "Discount cannot be negative"
    ).test(
      "discount-limit",
      t?.("validation.discountGreaterThanCost") ||
        "Discount cannot be greater than cost",
      function (value) {
        return (
          Number(value || 0) <=
          Number(this.parent.cost || 0)
        );
      }
    ),

    doctorFeeType: Yup.string()
      .oneOf(
        ["none", "fixed", "percentage"],
        t?.("validation.invalidDoctorFeeType") ||
          "Invalid doctor fee type"
      )
      .required(
        t?.("validation.doctorFeeTypeRequired") ||
          "Doctor fee type is required"
      ),

    doctorFeeValue: Yup.number()
      .min(
        0,
        t?.("validation.doctorFeeNegative") ||
          "Doctor fee cannot be negative"
      )
      .test(
        "percentage-limit",
        t?.("validation.doctorFeePercentageMax") ||
          "Doctor fee percentage cannot exceed 100",
        function (value) {
          if (
            this.parent.doctorFeeType !==
            "percentage"
          ) {
            return true;
          }

          return Number(value || 0) <= 100;
        }
      )
      .test(
        "fee-limit",
        t?.("validation.doctorFeeGreaterThanTotal") ||
          "Doctor fee cannot be greater than total amount",
        function (value) {
          if (
            this.parent.doctorFeeType !==
            "fixed"
          ) {
            return true;
          }

          const total =
            Number(this.parent.cost || 0) -
            Number(this.parent.discount || 0);

          return Number(value || 0) <= total;
        }
      ),

    notes: Yup.string().max(
      1000,
      t?.("validation.notesMax") ||
        "Notes cannot exceed 1000 characters"
    ),
  });