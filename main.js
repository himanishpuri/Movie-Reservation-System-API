import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import globalErrorHandler from "./src/util/globalErrorHandler.js";

const app = express();

app.use(
	cors({
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRouter from "./src/Routes/auth.route.js";
import adminRouter from "./src/Routes/admin.route.js";
import userRouter from "./src/Routes/user.route.js";
import commonRouter from "./src/Routes/common.route.js";

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api", commonRouter);

app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
