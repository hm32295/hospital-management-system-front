import * as Yup from "yup";

export const batchesSchema = (t) =>
  Yup.object({
    medicine: Yup.string().required(
      t?.("validation.medicineRequired") ||
        "medicine is required"
    ),

    batchNumber: Yup.string()
      .required(
        t?.("validation.batchNumberRequired") ||
          "batch Number is required"
      )
      .min(
        5,
        t?.("validation.batchNumberMin") ||
          "batch Number must be at least 5 characters"
      ),

    expiryDate: Yup.string().required(
      t?.("validation.expiryDateRequired") ||
        "expiry Date is required"
    ),

    purchasePrice: Yup.string().required(
      t?.("validation.purchasePriceRequired") ||
        "purchase Price Date is required"
    ),

    sellingPrice: Yup.string().required(
      t?.("validation.sellingPriceRequired") ||
        "selling Price Date is required"
    ),
  });