import express from "express";
import Joi from "joi";
import { HttpError } from "../../helpers/index.js";
import contactsService from "../../models/contacts.js"
const contactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
      "any.required": `"name" must be exist`,
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" must be exist`,
}),
phone: Joi.string().required().messages({
  "any.required": `phone" must be exist`,
}),
})

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.status(200).json(result);
}
catch (error) {
    next(error);
}
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
        throw HttpError(404, error.message);
    }
    res.status(200).json(result);
}
catch (error) {
    next(error);
}
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactsAddSchema.validate(req.body);
    if (error) {
        throw HttpError(400, "missing required name field")
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
}
catch (error) {
    next(error);
}
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
        throw HttpError(404, error.message);
    }
    res.status(200).json({
        message: "contact deleted"
    })
}
catch (error) {
    next(error);
}
})

router.put('/:id', async (req, res, next) => {
  try {
    const { error } = contactsAddSchema.validate(req.body);
    if (error) {
        throw HttpError(400, "missing fields")
    }
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
        throw HttpError(404, error.message);
    }
    res.status(200).json(result);
}
catch (error) {
    next(error);
}
})

export default router
