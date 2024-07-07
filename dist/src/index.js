"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = require("./routes/userRoutes");
const organisationRoutes_1 = require("./routes/organisationRoutes");
dotenv_1.default.config();
const PORT = 8080;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("STAGE 2 API.");
});
app.use("/", userRoutes_1.userRouter);
app.use("/api/organisations", organisationRoutes_1.orgRouter);
app.use("**", (req, res) => {
    res.send("Route not found");
});
const server = app.listen(PORT, () => console.log(`APP STARTED ON PORT ${PORT}`));
exports.server = server;
