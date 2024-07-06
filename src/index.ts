import express, { Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./routes/authRoutes";
import { orgRouter } from "./routes/organisationRoutes";

const PORT = 3030;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
	res.send("STAGE 2 API.");
});
app.use("/auth", authRouter);
app.use("/api/organisations", orgRouter);

app.use("**", (req: Request, res: Response) => {
	res.send("Route not found");
});

const start = () => {
	app.listen(PORT, () => console.log(`APP STARTED ON PORT ${PORT}`));
};

start();
