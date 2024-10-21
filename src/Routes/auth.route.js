import { Router } from "express";
const router = Router();
import { login, logout, register } from "../Controllers/auth.controller.js";
import {
	authenticateLoginDetails,
	authenticateLogoutDetails,
	authenticateRegistrationDetails,
} from "../Middlewares/auth.middleware.js";

router.post("/register", authenticateRegistrationDetails, register);
router.post("/login", authenticateLoginDetails, login);
router.post("/logout", authenticateLogoutDetails, logout);

export default router;
