import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string()
    .required("category name is required")
    .min(2, "category name must be at least 2 characters"),
  description: Yup.string()
    .required("description is required"),

});
 