import Joi from "joi";


const userSignupSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }).required(),
    subscription: Joi.string().required(),
})

const userSigninSchema = Joi.object({
    email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }).required(),
    password: Joi.string().min(6).required(),
})

export default {
    userSignupSchema,
    userSigninSchema,
}