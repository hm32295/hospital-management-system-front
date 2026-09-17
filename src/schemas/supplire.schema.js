import * as Yup from "yup";

export const supplierSchema = Yup.object({
  name: Yup.string()
    .required("supplier name is required")
    .min(2, "supplier name must be at least 2 characters"),
  phone: Yup.string()
    .required("phone is required")
    .min(11, "phone must be at least 11 characters"),
  address: Yup.string()
    .required("address is required")
    .min(2, "address must be at least 2 characters"),

  email: Yup.string()
    .email("Please enter a valid email")
        .required("Email is required"),
  

});
 