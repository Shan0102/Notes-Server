import express from "express";
import cors from "cors";

import usersRouter from "./routers/usersRouter";
import notesRouter from "./routers/notesRouter";
import { notFoundHandler, errorHandler } from "./utils/errorHandlers";
import googleOauthHandler from "./controllers/sessionsController";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter); // Assuming you have a notesRouter defined
app.get("/api/sessions/oauth/google", googleOauthHandler);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
