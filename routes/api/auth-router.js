import express from "express";

import usersSchemas from "../../Schema/users-schemas.js";
import validateBody from "../../decorators/validateBody.js";
import authController from "../../conrtollers/auth-controller.js";
import authenticate from "../../middlewars/authenticate.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(usersSchemas.userSignupSchema), authController.signup)

authRouter.post("/signin", validateBody(usersSchemas.userSigninSchema), authController.signin)

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

export default authRouter;