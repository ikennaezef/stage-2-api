import { Router } from "express";
import {
	getSingleUser,
	loginUser,
	registerUser,
} from "../controllers/userControllers";
import { verifyToken } from "../middleware/auth";
import { body } from "express-validator";

const authRouter = Router();

authRouter.post(
	"/auth/register",
	body("firstName").exists().withMessage("fistName is required!"),
	body("lastName").exists().withMessage("lastName is required!"),
	body("email").exists().withMessage("email is required!"),
	body("password").exists().withMessage("password is required!"),
	registerUser
);
authRouter.post("/api/auth/register", registerUser);
authRouter.post("/auth/login", loginUser);
authRouter.post("/api/auth/login", loginUser);
authRouter.get("/api/users/:id", verifyToken, getSingleUser);

export { authRouter as userRouter };
