import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { generateToken } from "../utils/jwt";
import { ExtendedReq } from "../types";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

const registerUser = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, email, password, phone } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(422)
				.json({ status: "Bad Request", errors: errors.array() });
		}
		if (!firstName || !lastName || !email || !password) {
			return res
				.status(422)
				.json({ message: "Please fill the required fields!" });
		}
		const userExists = await prisma.user.findFirst({ where: { email } });
		if (userExists) {
			return res.status(400).json({
				status: "Bad Request",
				message: "Registration unsuccessful",
				statusCode: 400,
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const userId = uuid();
		const orgId = uuid();
		const orgName = firstName + "'s Organisation";
		const newUser = await prisma.user.create({
			data: {
				userId,
				firstName,
				lastName,
				email,
				password: hashedPassword,
				phone,
				organisations: {
					create: [{ orgId, name: orgName, description: orgName }],
				},
			},
			select: {
				userId: true,
				firstName: true,
				lastName: true,
				email: true,
				phone: true,
			},
		});

		if (!newUser) {
			return res.status(400).json({
				status: "Bad request",
				message: "Registration unsuccessful",
				statusCode: 400,
			});
		}

		// Add user to org
		await prisma.organisation.update({
			where: { orgId },
			data: { users: { connect: [{ ...newUser }] } },
		});

		// const newOrg = await prisma.organisation.create({
		// 	data: {
		// 		orgId,
		// 		name: orgName,
		// 		description: orgName,
		// 		users: { connect: newUser },
		// 	},
		// });
		const token = generateToken({ userId, email });

		return res.status(201).json({
			status: "success",
			message: "Registration successful",
			data: {
				accessToken: token,
				user: newUser,
			},
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(401).json({
				statusCode: 401,
				status: "Bad request",
				message: "Authentication failed",
			});
		}
		const user = await prisma.user.findFirst({ where: { email } });
		if (!user) {
			return res.status(401).json({
				statusCode: 401,
				status: "Bad request",
				message: "Authentication failed",
			});
		}

		const comparePassword = await bcrypt.compare(password, user.password!);
		if (!comparePassword) {
			return res.status(401).json({
				statusCode: 401,
				status: "Bad request",
				message: "Authentication failed",
			});
		}

		const token = generateToken({ userId: user.userId, email });

		return res.status(200).json({
			status: "success",
			message: "Login successful",
			data: {
				accessToken: token,
				user: {
					userId: user.userId,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					phone: user.phone,
				},
			},
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
const getSingleUser = async (req: ExtendedReq, res: Response) => {
	try {
		const userEmail = req.email;
		const { id } = req.params;
		if (!userEmail) {
			return res.status(401).json({ message: "User not found" });
		}
		const user = await prisma.user.findFirst({
			where: { email: userEmail, userId: id },
			select: {
				userId: true,
				firstName: true,
				lastName: true,
				email: true,
				phone: true,
			},
		});
		if (!user) {
			return res.status(401).json({
				statusCode: 401,
				status: "Bad request",
				message: "User not found",
			});
		}

		return res
			.status(200)
			.json({ status: "success", message: "Success", data: user });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export { registerUser, loginUser, getSingleUser };
