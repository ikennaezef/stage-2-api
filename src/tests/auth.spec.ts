import request from "supertest";
import { server } from "..";

describe("Authentication API Endpoints", () => {
	let userID: any;
	let newUser = {
		firstName: "Test10 Firstname",
		lastName: "Test10 Lastname",
		email: "test10@mail.com",
		password: "password123",
		phone: "08604583",
	};

	afterAll(() => {
		server.close();
	});

	let token = "";

	it("should create a new user", async () => {
		const res = await request(server).post("/auth/register").send({
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			email: newUser.email,
			password: newUser.password,
			phone: newUser.phone,
		});

		expect(res.statusCode).toBe(201);
	}, 15000);

	it("signup fails if there are missing fields", async () => {
		const res = await request(server).post("/auth/register").send({
			email: "test@mail.com",
		});

		expect(res.statusCode).toBe(422);
	});

	it("signup fails if there is a duplicate email", async () => {
		const res = await request(server).post("/auth/register").send({
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			email: newUser.email,
			password: newUser.password,
			phone: newUser.phone,
		});

		expect(res.statusCode).toBe(422);
	}, 15000);

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
	});

	it("should get user organisations", async () => {
		const res = await request(server)
			.get("/api/organisations")
			.set({ authorization: `Bearer ${token}` });

		expect(res.statusCode).toEqual(200);
	}, 10000);

	it("should create a new organisation", async () => {
		const res = await request(server)
			.post("/api/organisations")
			.send({
				name: "Test Organisation",
				description: "Test desc",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(res.statusCode).toBe(201);
	}, 15000);
});
