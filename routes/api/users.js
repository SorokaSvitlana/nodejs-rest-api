import express from "express";
import updateAvatar from "../../conrtollers/users-controller.js";
import upload from "../../middlewars/upload.js";
import authenticate from "../../middlewars/authenticate.js";
import authController from "../../conrtollers/auth-controller.js";
import usersSchemas from "../../Schema/users-schemas.js";
import validateBody from "../../decorators/validateBody.js";
const usersRouter = express.Router();

usersRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar)

usersRouter.get("/verify/:verificationToken", authController.verify);
usersRouter.post("/verify", validateBody(usersSchemas.userEmailSchema), authController.resendVerifyEmail);

export default usersRouter;