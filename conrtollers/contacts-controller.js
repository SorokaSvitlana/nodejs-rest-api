import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { Contact } from "../models/contacts.js";

export const listContacts = async (req, res) => {
    const result = await Contact.find({}, "-createdAt -updatedAt");
    res.json(result);
    }
export const  addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  }
  
export const  getContactById = async (req, res) => {
      const { id } = req.params;
      const result = await Contact.findById(id);
      if (!result) {
          throw HttpError(404, `Contact with id=${id} not found`);
      }
      res.json(result);
  }
  
export const removeContact = async (req, res) => {
      const { id } = req.params;
      const result = await Contact.findByIdAndDelete(id);
      if (!result) {
          throw HttpError(404, `Contact with id=${id} not found`);
      }
      res.json({
          message: "Delete success"
      })
  }
export const updateContact = async (req, res) => {
        const { id } = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
    }

    export const updateFavorite = async (req, res) => {
      const { id } = req.params;
      const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
      if (!result) {
          throw HttpError(404, `Movie with id=${id} not found`);
      }
      res.json(result);
  }
  
  
export default {getContactById: ctrlWrapper(getContactById),
         removeContact: ctrlWrapper(removeContact), 
         addContact: ctrlWrapper(addContact), 
         listContacts: ctrlWrapper(listContacts), 
         updateContact: ctrlWrapper(updateContact),
        updateFavorite: ctrlWrapper(updateFavorite) }