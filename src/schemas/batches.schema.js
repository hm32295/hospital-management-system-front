import * as Yup from "yup";
export const batchesSchema = Yup.object({
  medicine: Yup.string()
    .required("medicine is required"),
  batchNumber: Yup.string()
    .required("batch Number is required")
    .min(5, "batch Number must be at least 5 characters"),
  expiryDate: Yup.string()
    .required("expiry Date is required"),
  purchasePrice: Yup.string()
    .required("purchase Price Date is required"),
  sellingPrice: Yup.string()
  .required("selling Price Date is required"),

  

});
 