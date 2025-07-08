import { Request, Response, NextFunction } from "express";
import * as userCervice from "../services/usersService";

async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await userCervice.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userWithToken = await userCervice.loginUser(req.body);
        res.status(200).json(userWithToken);
    } catch (error) {
        next(error);
    }
}

async function updateUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const userWithoutPassword = await userCervice.updateUserInfo(
            req.body,
            req.params.user_id,
            req.user
        );
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
}

async function updateUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
        await userCervice.updateUserPassword(req.body, req.params.user_id, req.user);
        res.status(204).json({ message: "User password updated successfully" });
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        await userCervice.deleteUser(req.params.user_id, req.user);
        res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export { createUser, loginUser, deleteUser, updateUserInfo, updateUserPassword };
