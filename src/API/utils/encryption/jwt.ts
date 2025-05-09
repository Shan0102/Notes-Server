import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { StringValue } from "ms";
import { JwtPayload } from "../../../types";

const SECRET_KEY = process.env.SECRET_JWT || "your secret key";

function generateToken(payload: object, expiresIn: StringValue | number = "24h"): string {
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn });
    return token;
}

function verifyToken(token: string): JwtPayload | null {
    try {
        const payload = jwt.verify(token, SECRET_KEY) as JwtPayload;
        if (typeof payload === "string") return null; // If the payload is a string, it means the token is invalid
        return payload;
    } catch (error) {
        return null;
    }
}

export { generateToken, verifyToken };
