import * as Yup from "yup";

export const medicineSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(
        t?.("validation.medicineNameRequired") ||
          "Medicine name is required"
      )
      .min(
        2,
        t?.("validation.medicineNameMin") ||
          "Medicine name must be at least 2 characters"
      ),

    genericName: Yup.string().required(
      t?.("validation.genericNameRequired") ||
        "Generic name is required"
    ),

    category: Yup.string().required(
      t?.("validation.categoryRequired") ||
        "Category is required"
    ),

    manufacturer: Yup.string().required(
      t?.("validation.manufacturerRequired") ||
        "Manufacturer is required"
    ),

    description: Yup.string().required(
      t?.("validation.descriptionRequired") ||
        "description is required"
    ),
  });