import Joi from "joi";
import * as Yup from "yup";
export const changePasswordSchema = Joi.object({
  Password: Joi.string().min(6).max(32).required().messages({
    "string.min": "Password can't be less than 6 letters!",
    "string.max": "Password can't be more than 32 letters!",
    "any.required": "Password can't be empty!",
    "string.empty": "Password can't be empty!",
  }),
  NewPassword: Joi.string().min(6).max(32).required().messages({
    "string.min": "Password can't be less than 6 letters!",
    "string.max": "Password can't be more than 32 letters!",
    "any.required": "Password can't be empty!",
    "string.empty": "Password can't be empty!",
  }),
  CfNewPassword: Joi.valid(Joi.ref("NewPassword")).messages({
    "any.only": "Password no match!",
  }),
});

export const loginSchema = Joi.object({
  Username: Joi.string().min(5).max(200).required().label("Username"),
  Password: Joi.string().min(6).max(32).required().label("Password"),
  Latitude: Joi.required(),
  Longitude: Joi.required(),
  LastLoginIP: Joi.required(),
});

export const profileSchema = Joi.object({
  FullName: Joi.string(),
  Bio: Joi.string(),
  BirthDate: Joi.string(),
  BirthPlace: Joi.string(),
  CurrentAdd: Joi.string(),
  Phone: Joi.string().min(10).max(15),
});

export const registerSchema = Yup.object().shape({
  Username: Yup.string().min(5, "Username must be at least 5 characters").max(200, "Username can't be more than 200 characters").required("Username is required"),

  FullName: Yup.string().required("Full Name is required"),

  Email: Yup.string().email("Invalid email format").required("Email is required"),

  Gender: Yup.string().required("Gender is required"),

  Password: Yup.string().min(6, "Password can't be less than 6 letters!").max(32, "Password can't be more than 32 letters!").required("Password can't be empty!"),

  Cf_Password: Yup.string()
    .oneOf([Yup.ref("Password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const postSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title can't be empty!",
    "any.required": "Title is required!",
  }),
  content: Joi.string().required().messages({
    "string.empty": "Content can't be empty!",
    "any.required": "Content is required!",
  }),

  PhotoURL: Joi.array(),
});

export const groupSchema = Joi.object({
  GroupName: Joi.string().required().messages({
    "string.empty": "GroupName can't be empty!",
    "any.required": "GroupName is required!",
  }),
  userNumber: Joi.number().required().min(10).max(200).integer().messages({
    "number.empty": "userNumber can't be empty!",
  }),
  avatarLink: Joi.string().required(),
});
