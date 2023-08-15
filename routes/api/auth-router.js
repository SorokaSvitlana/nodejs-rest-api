import express from "express";

import usersSchemas from "../../Schema/users-schemas.js";
import validateBody from "../../decorators/validateBody.js";
import authController from "../../conrtollers/auth-controller.js";
import authenticate from "../../middlewars/authenticate.js";
import upload from "../../middlewars/upload.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("avatar"), validateBody(usersSchemas.userSignupSchema), authController.register)
authRouter.post("/login", validateBody(usersSchemas.userSigninSchema), authController.login)
authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/current", authenticate, authController.getCurrentUser);



export default authRouter;