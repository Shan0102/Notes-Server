import { ensureUsersTableExists } from "../DB/db";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log(process.env.DB_PASSWORD);
        await ensureUsersTableExists();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
}

startServer();
