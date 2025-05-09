import mysql from "mysql2";
import pool from "./utils/pool.js";
import { tryCatchWrapper } from "./utils/tryCatch.js";
import { RecievedUser, User } from "../types/index.js";
import calcObjectMemory from "./utils/calcObjectMemory.js";

async function updateUserMemory(user_id: number, bytes: number) {
    const user = await getUserById(user_id);
    if (!user) {
        throw new Error(`Memory Error: User with ID ${user_id} not found`);
    }
    const memoryUsage = user.memory_usage + bytes;

    const values = [memoryUsage, user_id];
    const query = `UPDATE users SET memory_usage = ? WHERE user_id = ?`;
    const [result] = await pool.query(query, values);

    console.log(`[${new Date().toLocaleString()}]:User memory updated successfully:`, result);
}

const ensureUsersTableExists = tryCatchWrapper(async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
            user_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(30) NOT NULL,
            username VARCHAR(30) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            google_id VARCHAR(255) UNIQUE,
            role VARCHAR(10) NOT NULL DEFAULT 'user',
            memory_usage INT NOT NULL DEFAULT 0,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`;
    await pool.query(createTableQuery);
    console.log(`[${new Date().toLocaleString()}]:Users table checked/created successfully.`);
});

const createUser = tryCatchWrapper(async (user: RecievedUser): Promise<void> => {
    const values = [user.name, user.username, user.email, user.password, user.google_id];
    const query = `INSERT INTO users (name, username, email, password, google_id) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, values);

    const createdResult = result as mysql.ResultSetHeader;
    console.log(`[${new Date().toLocaleString()}]:User created successfully:`, result);

    const createdUser = await getUserById(createdResult.insertId);
    if (!createdUser) {
        throw new Error(`After creation: User with id: ${createdResult.insertId} not found`);
    }

    const bytes = calcObjectMemory(createdUser);
    await updateUserMemory(createdUser.user_id, bytes);
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

const getUserByGoogleId = tryCatchWrapper(
    async (google_id: string | null): Promise<User | null> => {
        if (google_id === null) return null;

        const query = `SELECT * FROM users WHERE google_id = ?`;
        const rows = await pool.query(query, [google_id]);
        const users = rows[0] as User[];

        if (users.length === 0) {
            return null;
        }

        console.log(`[${new Date().toLocaleString()}]:User retrieved successfully:`, users[0]);
        return users[0];
    }
);

const updateUser = tryCatchWrapper(async (user_id: number, user: Partial<User>): Promise<void> => {
    const oldUser = await getUserById(user_id);
    if (!oldUser) {
        throw new Error(`Before update: User with id: ${user_id} not found`);
    }

    const values = [user.name, user.username, user_id];
    const query = `UPDATE users SET name = ?, username = ? WHERE user_id = ?`;
    const [result] = await pool.query(query, values);

    const updatedResult = result as mysql.ResultSetHeader;
    if (updatedResult.affectedRows === 0) {
        throw new Error(`User with ID ${user_id} not found`);
    }

    console.log(`[${new Date().toLocaleString()}]:User updated successfully:`, updatedResult);

    const updatedUser = await getUserById(updatedResult.insertId);
    if (!updatedUser) {
        throw new Error(`After update: User with id: ${updatedResult.insertId} not found`);
    }

    const oldMemory = calcObjectMemory(oldUser);
    const newMemory = calcObjectMemory(updatedUser);

    await updateUserMemory(user_id, newMemory - oldMemory);
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
    updateUserMemory,
};
