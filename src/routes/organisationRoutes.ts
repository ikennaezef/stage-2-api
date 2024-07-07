import { Router } from "express";
import {
	addUserToOrganisation,
	createOrganisation,
	getSingleOrganisation,
	getUserOrganisations,
} from "../controllers/organisationControllers";
import { verifyToken } from "../middleware/auth";

const orgRouter = Router();

orgRouter.use(verifyToken);
orgRouter.get("/", getUserOrganisations);
orgRouter.get("/:id", getSingleOrganisation);
orgRouter.post("/", createOrganisation);
orgRouter.post("/:orgId/users", addUserToOrganisation);

export { orgRouter };
