import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

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

export default pool;
