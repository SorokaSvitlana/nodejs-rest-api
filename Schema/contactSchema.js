import Joi from "joi";

export const contactsAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }).required(),
  phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).required().messages({
    "validation": `phone" example "(692) 802-2949"`,})
  })
  
 export  const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
      "any.required": `favorite" must be exist`,})
  })
  
  export default {contactsAddSchema, updateFavoriteSchema}