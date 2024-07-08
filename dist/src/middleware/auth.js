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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization missing!" });
    }
    if (!authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Invalid authorization format!" });
    }
    const authToken = authHeader.split(" ")[1];
    try {
        const { email } = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET);
        req.email = email;
        next();
    }
    catch (error) {
        if (error.name == "TokenExpiredError") {
            res.status(401).json({ message: "Auth token expired!" });
        }
        else {
            res.status(401).json({ message: "Invalid authorization!" });
        }
    }
});
exports.verifyToken = verifyToken;
