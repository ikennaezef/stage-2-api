import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { userRouter } from "./routes/userRoutes";
import { orgRouter } from "./routes/organisationRoutes";

dotenv.config();
const PORT = 8080;

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
	res.send("STAGE 2 API.");
});
app.use("/", userRouter);
app.use("/api/organisations", orgRouter);

app.use("**", (req: Request, res: Response) => {
	res
		.status(400)
		.json({
			status: "Bad Request",
			statusCode: 404,
			message: "Route not found",
		});
});

const server = app.listen(PORT, () =>
	console.log(`APP STARTED ON PORT ${PORT}`)
);

export { server };
