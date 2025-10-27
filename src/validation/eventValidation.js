// src/validation/eventValidation.js
import * as yup from "yup";

// update
export const eventValidationSchema = yup.object({
  title: yup
    .string()
    .required("Event title is required")
    .min(4, "Title must be at least 4 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
});
