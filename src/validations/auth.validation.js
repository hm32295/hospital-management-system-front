
import * as Yup from "yup";

export const loginValidation = (t) =>
  Yup.object({
    email: Yup.string()
      .email(t("validation.invalidEmail"))
      .required(t("validation.emailRequired")),
    password: Yup.string()
      .required(t("validation.passwordRequired")),
  });
