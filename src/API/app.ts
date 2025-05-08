import express from "express";
import cors from "cors";

import usersRouter from "./routers/usersRouter";
import { notFoundHandler, errorHandler } from "./utils/errorHandlers";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", usersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
