
import * as Yup from "yup";
export const stockTransactionSchema = Yup.object({
  medicine: Yup.string()
    .required("medicine is required"),
  batch: Yup.string()
    .required("batch Number is required"),
  quantity: Yup.string()
    .required("batch Number is required"),
  type: Yup.string()
    .required("type is required"),
  reason: Yup.string()
    .required("reason is required"),

  

});
