import { Router } from "express";
import {
	addUserToOrganisation,
	createOrganisation,
	getSingleOrganisation,
	getUserOrganisations,
} from "../controllers/organisationControllers";

const orgRouter = Router();

orgRouter.get("/", getUserOrganisations);
orgRouter.get("/:id", getSingleOrganisation);
orgRouter.post("/", createOrganisation);
orgRouter.post("/:orgId/users", addUserToOrganisation);

export { orgRouter };
