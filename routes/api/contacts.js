import express from "express";
import contactsService from "../../conrtollers/contacts-controller.js"
import isValidId from "../../middlewars/isValidid.js";
import isEmptyBody from "../../middlewars/isEmptyBody.js";
import validateBody from "../../decorators/validateBody.js";
import { contactsAddSchema, updateFavoriteSchema } from "../../Schema/contactSchema.js";
import authenticate from "../../middlewars/authenticate.js";


const router = express.Router()
router.use(authenticate);

router.get('/',  contactsService.listContacts);

router.get('/:id', isValidId, contactsService.getContactById);

router.post('/', isEmptyBody , validateBody(contactsAddSchema), contactsService.addContact)

router.delete('/:id', isValidId, contactsService.removeContact)

router.put('/:id', isValidId, validateBody(contactsAddSchema), contactsService.updateContact)

router.patch("/:id/favorite", isValidId, isEmptyBody, validateBody(updateFavoriteSchema), contactsService.updateFavorite);

export default router