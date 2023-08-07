import express from "express";
import updateAvatar from "../../conrtollers/users-controller.js";
import upload from "../../middlewars/upload.js";
import authenticate from "../../middlewars/authenticate.js";
const usersRouter = express.Router();

usersRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar)

export default usersRouter;