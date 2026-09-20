import * as Yup from "yup";

export const categorySchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(
        t?.("validation.categoryNameRequired") ||
          "category name is required"
      )
      .min(
        2,
        t?.("validation.categoryNameMin") ||
          "category name must be at least 2 characters"
      ),

    description: Yup.string().required(
      t?.("validation.descriptionRequired") ||
        "description is required"
    ),
  });