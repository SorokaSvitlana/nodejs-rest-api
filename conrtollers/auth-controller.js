import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import ctrlWrapper  from "../decorators/ctrlWrapper.js";
import  HttpError  from "../helpers/HttpError.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";
import createVerifyEmail from "../helpers/createVerifyEmail.js";

const verificationToken = nanoid();


const avatarPath = path.resolve("public", "avatars");

const {JWT_SECRET} = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw HttpError(400, "Email and password are required");
  }
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const avatar = path.join("public", "avatars", filename);

  const newUser = await User.create({ ...req.body, avatar, password: hashPassword, verificationToken });
  const avatarURL = gravatar.url(email, { s: "200", d: "identicon" });

  const verifyEmail = createVerifyEmail({email, verificationToken});
  await sendEmail(verifyEmail);

  res.status(201).json({
    subscription: newUser.subscription,
    email: newUser.email,
    avatar,
  });
};
const login = async(req, res) => {
  const {email, password} = req.body;
    if (!email || !password) {
        throw HttpError(400, "Email and password are required");
      }
  const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
      throw HttpError(404, "User not found");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    }
  const payload = {
        id: user._id,
    }

  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});
    res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    };

const verify = async (req, res) => {
      const { verificationToken } = req.params;
      const user = await User.findOne({ verificationToken });
      if (!user) {
          throw HttpError(404, "User not found");
      }
      await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
  
      res.status(200).json({
          message: "Verification successful"
      })
  }

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "Email not found" });
    }

    if (user.verify) {
        return res.status(400).json({ message: "Email already verified" });
    }

    const verifyEmail = createVerifyEmail({ email, verificationToken: user.verificationToken });

    try {
        await sendEmail(verifyEmail);
        res.json({ message: "Resend email success" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending verification email" });
    }
}


  const getCurrentUser = async (req, res) => {
        const { _id } = req.user;
        const user = await User.findById(_id);
        if (!user) {
          throw HttpError(401, "Not authorized");
        }
        res.status(200).json({
          email: user.email,
          subscription: user.subscription,
        });
      };

const logout = async(req, res)=> {
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(_id, {token: ""});
    if (!user) {
        throw HttpError(401, "Not authorized");
      }
    res.status(204).json({
        message: "Signout ssucess"
    })
}

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrentUser: ctrlWrapper(getCurrentUser),
    logout: ctrlWrapper(logout),
    verify:ctrlWrapper(verify),
    resendVerifyEmail:ctrlWrapper(resendVerifyEmail),
}