import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import ctrlWrapper  from "../decorators/ctrlWrapper.js";
import  HttpError  from "../helpers/HttpError.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";

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

  const newUser = await User.create({ ...req.body, avatar, password: hashPassword });
  const avatarURL = gravatar.url(email, { s: "200", d: "identicon" });
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
}