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
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
describe("Authentication API Endpoints", () => {
    let userID;
    let newUser = {
        firstName: "Test10 Firstname",
        lastName: "Test10 Lastname",
        email: "test10@mail.com",
        password: "password123",
        phone: "08604583",
    };
    afterAll(() => {
        __1.server.close();
    });
    let token = "";
    it("should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.server).post("/auth/register").send({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
            phone: newUser.phone,
        });
        expect(res.statusCode).toBe(201);
    }), 15000);
    it("signup fails if there are missing fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.server).post("/auth/register").send({
            email: "test@mail.com",
        });
        expect(res.statusCode).toBe(422);
    }));
    it("signup fails if there is a duplicate email", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.server).post("/auth/register").send({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
            phone: newUser.phone,
        });
        expect(res.statusCode).toBe(422);
    }), 15000);
    it("should login the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.server).post("/auth/login").send({
            email: newUser.email,
            password: newUser.password,
        });
        expect(res.statusCode).toBe(200);
    }));
    it("should generate a token", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.server).post("/auth/login").send({
            email: newUser.email,
            password: newUser.password,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.accessToken).toBeTruthy();
        token = res.body.data.accessToken;
    }));
    it("login fails if there are missing fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.server).post("/auth/login").send({
            email: newUser.email,
        });
        expect(res.statusCode).toBe(401);
    }));
    it("should get user organisations", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.server)
            .get("/api/organisations")
            .set({ authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(200);
    }), 10000);
    it("should create a new organisation", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.server)
            .post("/api/organisations")
            .send({
            name: "Test Organisation",
            description: "Test desc",
        })
            .set({ authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(201);
    }), 15000);
});
