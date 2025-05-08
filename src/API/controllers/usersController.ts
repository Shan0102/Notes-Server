import { Request, Response, NextFunction } from "express";
import * as UserDB from "../../DB/db";
import { RecievedUser, User } from "../../types/index";
import validateUser, { checkId } from "../utils/validation";
import createErrorApp from "../utils/createError";

import { getHash, comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";

async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.body as RecievedUser;
        validateUser(user);

        const existingEmail = await UserDB.getUserByEmail(user.email);
        const existingUsername = await UserDB.getUserByUsername(user.username);
        let existingGoogleId = null;
        if (user.google_id) {
            existingGoogleId = await UserDB.getUserByGoogleId(user.google_id);
        }

        if (existingEmail) createErrorApp("Email already exists", 409);
        if (existingUsername) createErrorApp("Username already exists", 409);
        if (existingGoogleId) createErrorApp("Google ID already exists", 409);

        const hashedPassword = await getHash(user.password);

        const newUser: RecievedUser = {
            ...user,
            password: hashedPassword,
        };

        await UserDB.createUser(newUser);

        const createdUser = await UserDB.getUserByEmail(user.email);
        if (!createdUser) createErrorApp("User creation failed", 500);

        const { password, ...userWithoutPassword } = createdUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { data, password, dataType } = req.body;
        if (!data) createErrorApp("Username or email is required", 400);
        if (!password) createErrorApp("Password is required", 400);

        let user: User | null = null;

        if (dataType === "email") user = await UserDB.getUserByEmail(data);
        else if (dataType === "username") user = await UserDB.getUserByUsername(data);

        if (!user) createErrorApp("Invalid username or password", 401);

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            createErrorApp("Invalid username or password", 401);
        }

        const token = generateToken({ user_id: user.user_id });

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = parseInt(req.params.user_id);
        checkId(user_id);

        const user: User | null = await UserDB.getUserById(user_id);
        if (!user) {
            createErrorApp("User not found", 404);
        }

        if (!req.user) createErrorApp("Unauthorized", 401);
        if (req.user.role !== "_admin" && req.user.user_id !== user_id) {
            createErrorApp("Unauthorized", 403);
        }

        await UserDB.deleteUser(user_id);
        res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export { createUser, loginUser, deleteUser };
