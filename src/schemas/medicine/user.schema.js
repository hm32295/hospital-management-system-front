import * as Yup from "yup";

export const userSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(
        t?.("validation.userNameRequired") ||
          "user name is required"
      )
      .min(
        2,
        t?.("validation.userNameMin") ||
          "user name must be at least 2 characters"
      ),

    email: Yup.string()
      .email(
        t?.("validation.invalidEmail") ||
          "Please enter a valid email"
      )
      .required(
        t?.("validation.emailRequired") ||
          "email is required"
      ),

    role: Yup.string().required(
      t?.("validation.roleRequired") ||
        "role is required"
    ),
  });