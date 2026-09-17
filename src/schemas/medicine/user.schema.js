import * as Yup from "yup";

export const userSchema = Yup.object({
  name: Yup.string()
    .required("user name is required")
    .min(2, "user name must be at least 2 characters"),

    email: Yup.string()
      .email("Please enter a valid email")
    .required("email is required"),

  role: Yup.string()
    .required("role is required"),


});
 