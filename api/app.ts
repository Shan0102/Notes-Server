import express from "express";
import cors from "cors";

import usersRouter from "./server/routers/usersRouter";
import notesRouter from "./server/routers/notesRouter";
import { notFoundHandler, errorHandler } from "./server/utils/errorHandlers";
import googleOauthHandler from "./server/controllers/sessionsController";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter); // Assuming you have a notesRouter defined
app.get("/api/sessions/oauth/google", googleOauthHandler);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
