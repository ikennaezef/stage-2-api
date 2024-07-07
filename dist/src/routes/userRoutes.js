"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const auth_1 = require("../middleware/auth");
const authRouter = (0, express_1.Router)();
exports.userRouter = authRouter;
authRouter.post("/auth/register", userControllers_1.registerUser);
authRouter.post("/auth/login", userControllers_1.loginUser);
authRouter.get("/api/users/:id", auth_1.verifyToken, userControllers_1.getSingleUser);