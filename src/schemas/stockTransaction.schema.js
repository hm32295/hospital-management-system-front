
import * as Yup from "yup";

export const stockTransactionSchema = (t) =>
  Yup.object({
    medicine: Yup.string().required(
      t?.("validation.medicineRequired") ||
        "medicine is required"
    ),

    batch: Yup.string().required(
      t?.("validation.batchNumberRequired") ||
        "batch Number is required"
    ),

    quantity: Yup.string().required(
      t?.("validation.batchNumberRequired") ||
        "batch Number is required"
    ),

    type: Yup.string().required(
      t?.("validation.typeRequired") ||
        "type is required"
    ),

    reason: Yup.string().required(
      t?.("validation.reasonRequired") ||
        "reason is required"
    ),
  });