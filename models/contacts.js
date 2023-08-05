import {Schema, model} from "mongoose";
import { handleSaveError, validateAtUpdate } from "./hooks.js";
export const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }
}, {versionKey: false, timestamps: true})

contactsSchema.pre("findOneAndUpdate", validateAtUpdate);
contactsSchema.post("save", handleSaveError);
contactsSchema.post("findOneAndUpdate", handleSaveError);

export const Contact = model("contact", contactsSchema);