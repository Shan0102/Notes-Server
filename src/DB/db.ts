import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

import { tryCatchWrapper } from "./utils/tryCatch.js";
import { RecievedUser, User } from "../types/index.js";

const initializePool = () => {
    return mysql
        .createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 10,
            connectTimeout: 60000,
        })
        .promise();
};

const pool = initializePool();

const ensureUsersTableExists = tryCatchWrapper(async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
            user_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(30) NOT NULL,
            username VARCHAR(30) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            google_id VARCHAR(255) UNIQUE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`;
    await pool.query(createTableQuery);
    console.log(`[${new Date().toLocaleString()}]:Notes table checked/created successfully.`);
});

const createUser = tryCatchWrapper(async (user: RecievedUser): Promise<void> => {
    const values = [user.name, user.username, user.email, user.password, user.google_id];
    const query = `INSERT INTO users (name, username, email, password, google_id) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, values);
    console.log(`[${new Date().toLocaleString()}]:User created successfully:`, result);
});

const getUserById = tryCatchWrapper(async (user_id: number): Promise<User | null> => {
    const query = `SELECT * FROM users WHERE user_id = ?`;
    const rows = await pool.query(query, [user_id]);
    const users = rows[0] as User[];

    if (users.length === 0) {
        return null;
    }

    console.log(`[${new Date().toLocaleString()}]:User retrieved successfully:`, users[0]);
    return users[0];
});

const getUserByEmail = tryCatchWrapper(async (email: string): Promise<User | null> => {
    const query = `SELECT * FROM users WHERE email = ?`;
    const rows = await pool.query(query, [email]);
    const users = rows[0] as User[];

    if (users.length === 0) {
        return null;
    }

    console.log(`[${new Date().toLocaleString()}]:User retrieved successfully:`, users[0]);
    return users[0];
});

const getUserByUsername = tryCatchWrapper(async (username: string): Promise<User | null> => {
    const query = `SELECT * FROM users WHERE username = ?`;
    const rows = await pool.query(query, [username]);
    const users = rows[0] as User[];

    if (users.length === 0) {
        return null;
    }

    console.log(`[${new Date().toLocaleString()}]:User retrieved successfully:`, users[0]);
    return users[0];
});

const getUserByGoogleId = tryCatchWrapper(async (google_id: string): Promise<User | null> => {
    const query = `SELECT * FROM users WHERE google_id = ?`;
    const rows = await pool.query(query, [google_id]);
    const users = rows[0] as User[];

    if (users.length === 0) {
        return null;
    }

    console.log(`[${new Date().toLocaleString()}]:User retrieved successfully:`, users[0]);
    return users[0];
});

const updateUser = tryCatchWrapper(async (user_id: number, user: Partial<User>): Promise<void> => {
    const values = [user.name, user.username, user_id];
    const query = `UPDATE users SET name = ?, username = ? WHERE user_id = ?`;
    const [result] = await pool.query(query, values);

    const updatedResult = result as mysql.ResultSetHeader;
    if (updatedResult.affectedRows === 0) {
        throw new Error(`User with ID ${user_id} not found`);
    }

    console.log(`[${new Date().toLocaleString()}]:User updated successfully:`, updatedResult);
});

const deleteUser = tryCatchWrapper(async (user_id: number): Promise<void> => {
    const query = `DELETE FROM users WHERE user_id = ?`;
    const [result] = await pool.query(query, [user_id]);

    const deletedResult = result as mysql.ResultSetHeader;
    if (deletedResult.affectedRows === 0) {
        throw new Error(`User with ID ${user_id} not found`);
    }

    console.log(`[${new Date().toLocaleString()}]:User deleted successfully:`, deletedResult);
});

export {
    ensureUsersTableExists,
    createUser,
    getUserById,
    getUserByEmail,
    getUserByUsername,
    getUserByGoogleId,
    updateUser,
    deleteUser,
};
