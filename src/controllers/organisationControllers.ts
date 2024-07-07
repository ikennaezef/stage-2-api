import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { PrismaClient } from "@prisma/client";
import { ExtendedReq } from "../types";

const prisma = new PrismaClient();

const getUserOrganisations = async (req: ExtendedReq, res: Response) => {
	try {
		const userOrgs = await prisma.user.findFirst({
			where: { email: req.email },
			include: { organisations: true },
		});

		if (!userOrgs) {
			return res.status(400).json({
				status: "Bad Request",
				message: "Client Error",
				statusCode: 400,
			});
		}

		return res.status(200).json({
			status: "success",
			message: "Success",
			data: { organisations: userOrgs.organisations },
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const getSingleOrganisation = async (req: ExtendedReq, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.userId;
		const org = await prisma.organisation.findFirst({
			where: { orgId: id, users: { some: { userId } } },
		});

		if (!org) {
			return res
				.status(400)
				.json({ status: "Client Error", message: "Organisation not found" });
		}

		return res
			.status(200)
			.json({ status: "sucsess", message: "Success", data: org });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const createOrganisation = async (req: ExtendedReq, res: Response) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res.status(422).json({
				errors: [{ field: "name", message: "name field is required" }],
			});
		}
		const orgOwner = await prisma.user.findFirst({
			where: { email: req.email },
			include: { organisations: true },
		});
		if (!orgOwner) {
			return res.status(400).json({
				status: "Bad Request",
				message: "Client error",
				statusCode: 400,
			});
		}

		const orgId = uuid();
		const newOrg = await prisma.organisation.create({
			data: {
				orgId,
				name,
				description,
				users: { connect: [{ ...orgOwner, organisations: undefined }] },
			},
			select: { orgId: true, name: true, description: true },
		});

		if (!newOrg) {
			return res.status(400).json({
				status: "Bad Request",
				message: "Client error",
				statusCode: 400,
			});
		}

		await prisma.user.update({
			where: { email: req.email },
			data: { organisations: { set: [...orgOwner.organisations, newOrg] } },
		});

		return res.status(201).json({
			status: "success",
			message: "Organisation created successfully",
			data: newOrg,
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const addUserToOrganisation = async (req: ExtendedReq, res: Response) => {
	try {
		const { orgId } = req.params;
		const { userId } = req.body;

		if (!userId) {
			return res.status(422).json({
				errors: [{ field: "userId", message: "userId field is required" }],
			});
		}

		const userExists = await prisma.user.findFirst({ where: { userId } });
		if (!userExists) {
			return res.status(404).json({ message: "User not found" });
		}

		const org = await prisma.organisation.findFirst({
			where: { orgId },
			include: { users: true },
		});
		if (!org) {
			return res.status(404).json({ message: "Organisation not found" });
		}

		const userAdded = await prisma.organisation.update({
			data: { users: { set: [...org.users, userExists] } },
			where: { orgId },
		});
		if (!userAdded) {
			return res.status(400).json({
				status: "Bad Request",
				message: "Client Error",
				statusCode: 400,
			});
		}

		return res.status(200).json({
			status: "success",
			message: "User added to organisation successfully ",
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export {
	getSingleOrganisation,
	getUserOrganisations,
	addUserToOrganisation,
	createOrganisation,
};
