import { ensureNotesTableExists } from "../db/notesTable";
import { ensureUsersTableExists } from "../db/usersTable";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await ensureUsersTableExists();
        await ensureNotesTableExists();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
}

startServer();
