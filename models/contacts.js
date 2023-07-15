import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve( 'models', 'contacts.json');
const updateContactStorage = contact => fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));

export const listContacts = async () => {
    try {
      const data = await fs.readFile(contactsPath);
      const contacts = JSON.parse(data);
      return contacts;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; 
      }
      throw error;
    }
  }
  export const  addContact = async({name, email, phone}) => {
    try {
        const contacts = await listContacts();
        const newContact = { id: nanoid(), name, email, phone };
        contacts.push(newContact);
        await updateContactStorage(contacts);
        return newContact;
      } catch (error) {
        throw error;
      }
    }

  export const  getContactById = async(contactId) => {
    try {
      const contacts = await listContacts();
      const contact = contacts.find((contact) => contact.id === contactId);
      return contact || null;
    } catch (error) {
      throw error;
    }
  }

  export const removeContact = async(contactId) => {
    try {
        const contacts = await listContacts();
        const index = contacts.findIndex(item => item.id === contactId);
        if(index === -1){
            return null;
        }
        const [result] = contacts.splice(index, 1);
        await updateContactStorage(contacts);
        return result;}
         catch (error) {
        throw error;
      }
    }

    export const updateContact = async (contactId, updatedContact) => {
      try {
        const contacts = await listContacts();
        const index = contacts.findIndex(item => item.id === contactId);
        
        if (index === -1) {
          return null;
        }
        
        contacts[index] = { id: contactId, ...updatedContact };
        await updateContactStorage(contacts);
        
        return contacts[index];
      } catch (error) {
        throw error;
      }
    };
    export default {getContactById, removeContact, addContact, listContacts, updateContact}