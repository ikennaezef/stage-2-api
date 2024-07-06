import { Request, Response } from "express";

const getUserOrganisations = async (req: Request, res: Response) => {
	res.send("Get user orgs");
};
const getSingleOrganisation = async (req: Request, res: Response) => {
	res.send("Get single org");
};
const createOrganisation = async (req: Request, res: Response) => {
	res.send("Create new org");
};
const addUserToOrganisation = async (req: Request, res: Response) => {
	res.send("Add user to org");
};

export {
	getSingleOrganisation,
	getUserOrganisations,
	addUserToOrganisation,
	createOrganisation,
};
