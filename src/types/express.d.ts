import { JwtPayload } from "./index";

declare global {
    namespace Express {
        interface Request {
            user?: {
                user_id: number;
                role?: string;
            };
        }
    }
}
