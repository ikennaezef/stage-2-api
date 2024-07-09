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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleUser = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jwt_1 = require("../utils/jwt");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
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
        const userExists = yield prisma.user.findFirst({ where: { email } });
        if (userExists) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Registration unsuccessful",
                statusCode: 400,
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const userId = (0, uuid_1.v4)();
        const orgId = (0, uuid_1.v4)();
        const orgName = firstName + "'s Organisation";
        const newUser = yield prisma.user.create({
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
        yield prisma.organisation.update({
            where: { orgId },
            data: { users: { connect: [Object.assign({}, newUser)] } },
        });
        // const newOrg = await prisma.organisation.create({
        // 	data: {
        // 		orgId,
        // 		name: orgName,
        // 		description: orgName,
        // 		users: { connect: newUser },
        // 	},
        // });
        const token = (0, jwt_1.generateToken)({ userId, email });
        return res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: {
                accessToken: token,
                user: newUser,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                statusCode: 401,
                status: "Bad request",
                message: "Authentication failed",
            });
        }
        const user = yield prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(401).json({
                statusCode: 401,
                status: "Bad request",
                message: "Authentication failed",
            });
        }
        const comparePassword = yield bcrypt_1.default.compare(password, user.password);
        if (!comparePassword) {
            return res.status(401).json({
                statusCode: 401,
                status: "Bad request",
                message: "Authentication failed",
            });
        }
        const token = (0, jwt_1.generateToken)({ userId: user.userId, email });
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.email;
        const { id } = req.params;
        if (!userEmail) {
            return res.status(401).json({ message: "User not found" });
        }
        const user = yield prisma.user.findFirst({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSingleUser = getSingleUser;
