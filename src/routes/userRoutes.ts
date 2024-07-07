import { Router } from "express";
import {
	getSingleUser,
	loginUser,
	registerUser,
} from "../controllers/userControllers";
import { verifyToken } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", loginUser);
authRouter.get("/api/users/:id", verifyToken, getSingleUser);

export { authRouter as userRouter };
