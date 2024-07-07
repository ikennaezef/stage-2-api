import request from "supertest";
import { server } from "..";

const newUser = {
	firstName: "Test2 Firstname",
	lastName: "Test2 Lastname",
	email: "test2@mail.com",
	password: "password123",
	phone: "08604583",
};

describe("Authentication API Endpoints", () => {
	let userID: any;

	afterAll(() => {
		server.close();
	});

	beforeEach(() => {
		jest.setTimeout(200000);
	});

	let token = "";

	it("should create a new user", async () => {
		const res = await request(server).post("/auth/register").send(newUser);

		expect(res.statusCode).toBe(201);
		userID = res.body?.data.user.userId;
	});

	it("signup fails if there are missing fields", async () => {
		const res = await request(server).post("/auth/register").send({
			email: "test@mail.com",
		});

		expect(res.statusCode).toBe(422);
	});
	it("signup fails if there is a duplicate email", async () => {
		const res = await request(server).post("/auth/register").send(newUser);

		expect(res.statusCode).toBe(422);
	});

	it("should login the user", async () => {
		const res = await request(server).post("/auth/login").send({
			email: newUser.email,
			password: newUser.password,
		});

		expect(res.statusCode).toBe(200);
	});

	it("should generate a token", async () => {
		const res = await request(server).post("/auth/login").send({
			email: newUser.email,
			password: newUser.password,
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.data.accessToken).toBeTruthy();
		token = res.body.data.accessToken;
	});

	it("login fails if there are missing fields", async () => {
		const res = await request(server).post("/auth/login").send({
			email: newUser.email,
		});

		expect(res.statusCode).toBe(401);
		// expect(res.body.title).toEqual("Test Book");
	});

	it("should get user organisations", async () => {
		const res = await request(server)
			.get("/api/organisations")
			.auth(token, { type: "bearer" });
		expect(res.statusCode).toEqual(200);
	});

	it("should create a new organisation", async () => {
		const res = await request(server)
			.post("/auth/register")
			.send({
				name: "Test Organisation",
				description: "Test desc",
			})
			.auth(token, { type: "bearer" });

		expect(res.statusCode).toBe(201);
	});
});
