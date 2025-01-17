"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgRouter = void 0;
const express_1 = require("express");
const organisationControllers_1 = require("../controllers/organisationControllers");
const auth_1 = require("../middleware/auth");
const orgRouter = (0, express_1.Router)();
exports.orgRouter = orgRouter;
orgRouter.use(auth_1.verifyToken);
orgRouter.get("/", organisationControllers_1.getUserOrganisations);
orgRouter.get("/:id", organisationControllers_1.getSingleOrganisation);
orgRouter.post("/", organisationControllers_1.createOrganisation);
orgRouter.post("/:orgId/users", organisationControllers_1.addUserToOrganisation);
