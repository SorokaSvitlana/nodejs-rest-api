import express from "express";
import contactsService from "../../conrtollers/contacts-controller.js"
import isValidId from "../../middlewars/isValidid.js";
import isEmptyBody from "../../middlewars/isEmptyBody.js";
import validateBody from "../../decorators/validateBody.js";
import { contactsAddSchema, updateFavoriteSchema } from "../../Schema/contactSchema.js";
import authenticate from "../../middlewars/authenticate.js";


const routerContacts = express.Router()
routerContacts.use(authenticate);

routerContacts.get('/',  contactsService.listContacts);
routerContacts.get('/:id', isValidId, contactsService.getContactById);
routerContacts.post('/', isEmptyBody , validateBody(contactsAddSchema), contactsService.addContact)
routerContacts.delete('/:id', isValidId, contactsService.removeContact)
routerContacts.put('/:id', isValidId, validateBody(contactsAddSchema), contactsService.updateContact)
routerContacts.patch("/:id/favorite", isValidId, isEmptyBody, validateBody(updateFavoriteSchema), contactsService.updateFavorite);

export default routerContacts