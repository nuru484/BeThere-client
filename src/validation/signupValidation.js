// src/validation/signupValidation.js
import * as yup from "yup";

// Yup validation schema
const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

export default schema;
