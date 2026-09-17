import * as Yup from "yup";

export const operationSchema = Yup.object({
  patient: Yup.string()
    .required("Patient is required"),

  doctor: Yup.string()
    .required("Doctor is required"),

  specialty: Yup.string()
    .required("Specialty is required"),

  operationName: Yup.string()
    .required("Operation name is required")
    .max(
      200,
      "Operation name cannot exceed 200 characters"
    ),

  operationDate: Yup.date()
    .required("Operation date is required")
    .typeError("Invalid operation date"),

  cost: Yup.number()
    .required("Cost is required")
    .min(0, "Cost cannot be negative"),

  discount: Yup.number()
    .min(0, "Discount cannot be negative")
    .test(
      "discount-limit",
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
      "Invalid doctor fee type"
    )
    .required("Doctor fee type is required"),

  doctorFeeValue: Yup.number()
    .min(
      0,
      "Doctor fee cannot be negative"
    )
    .test(
      "percentage-limit",
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
    "Notes cannot exceed 1000 characters"
  ),
});