"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganisation = exports.addUserToOrganisation = exports.getUserOrganisations = exports.getSingleOrganisation = void 0;
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUserOrganisations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userOrgs = yield prisma.user.findFirst({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserOrganisations = getUserOrganisations;
const getSingleOrganisation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const org = yield prisma.organisation.findFirst({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSingleOrganisation = getSingleOrganisation;
const createOrganisation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(422).json({
                errors: [{ field: "name", message: "name field is required" }],
            });
        }
        const orgOwner = yield prisma.user.findFirst({
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
        const orgId = (0, uuid_1.v4)();
        const newOrg = yield prisma.organisation.create({
            data: {
                orgId,
                name,
                description,
                users: { connect: [Object.assign(Object.assign({}, orgOwner), { organisations: undefined })] },
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
        yield prisma.user.update({
            where: { email: req.email },
            data: { organisations: { set: [...orgOwner.organisations, newOrg] } },
        });
        return res.status(201).json({
            status: "success",
            message: "Organisation created successfully",
            data: newOrg,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createOrganisation = createOrganisation;
const addUserToOrganisation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orgId } = req.params;
        const { userId } = req.body;
        if (!userId) {
            return res.status(422).json({
                errors: [{ field: "userId", message: "userId field is required" }],
            });
        }
        const userExists = yield prisma.user.findFirst({ where: { userId } });
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }
        const org = yield prisma.organisation.findFirst({
            where: { orgId },
            include: { users: true },
        });
        if (!org) {
            return res.status(404).json({ message: "Organisation not found" });
        }
        const userAdded = yield prisma.organisation.update({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addUserToOrganisation = addUserToOrganisation;
