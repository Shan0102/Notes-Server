import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/encryption/jwt";
import createErrorApp from "../utils/creation/createError";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            createErrorApp("Unauthorized: No token provided", 401);
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded || typeof decoded !== "object" || !decoded.user_id || !decoded.role) {
            createErrorApp("Unauthorized: Invalid token", 401);
        }

        req.user = { user_id: decoded.user_id, role: decoded.role }; // Attach user ID to request
        next();
    } catch (error) {
        next(error);
    }
}

export default authMiddleware;
