import express from "express";
import Joi from "joi";
import contactsService from "../../conrtollers/contacts-controller.js"
import isValidId from "../../middlewars/isValidid.js";
import isEmptyBody from "../../middlewars/isEmptyBody.js";
import validateBody from "../../decorators/validateBody.js";

const contactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
      "any.required": `"name" must be exist`,
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" must be exist`,
}),
phone: Joi.string().required().messages({
  "any.required": `phone" must be exist`,
})
})

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `favorite" must be exist`,})
})

const router = express.Router()

router.get('/',  contactsService.listContacts);

router.get('/:id', isValidId, contactsService.getContactById);

router.post('/', isEmptyBody , validateBody(contactsAddSchema), contactsService.addContact)

router.delete('/:id', isValidId, contactsService.removeContact)

router.put('/:id', isValidId, validateBody(contactsAddSchema), contactsService.updateContact)

router.patch("/:id/favorite", isValidId, isEmptyBody, validateBody(updateFavoriteSchema), contactsService.updateFavorite);

export default router