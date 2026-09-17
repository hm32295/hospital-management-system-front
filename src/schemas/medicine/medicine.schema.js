import * as Yup from "yup";

export const medicineSchema = Yup.object({
  name: Yup.string()
    .required("Medicine name is required")
    .min(2, "Medicine name must be at least 2 characters"),

  genericName: Yup.string()
    .required("Generic name is required"),

  category: Yup.string()
    .required("Category is required"),

  manufacturer: Yup.string()
    .required("Manufacturer is required"),
  description: Yup.string()
    .required("description is required"),

});
 