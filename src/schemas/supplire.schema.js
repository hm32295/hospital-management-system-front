import * as Yup from "yup";

export const supplierSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(t("validation.supplierNameRequired"))
      .min(2, t("validation.supplierNameMin")),

    phone: Yup.string()
      .required(t("validation.phoneRequired"))
      .min(11, t("validation.phoneMin")),

    address: Yup.string()
      .required(t("validation.addressRequired"))
      .min(2, t("validation.addressMin")),

    email: Yup.string()
      .email(t("validation.invalidEmail"))
      .required(t("validation.emailRequired")),
  });