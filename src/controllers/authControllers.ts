import { Request, Response } from "express";

const registerUser = async (req: Request, res: Response) => {
	res.send("Register User");
};
const loginUser = async (req: Request, res: Response) => {
	res.send("Login User");
};

export { registerUser, loginUser };
