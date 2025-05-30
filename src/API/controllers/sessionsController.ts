import { Request, Response, NextFunction } from "express";
import * as sessionsService from "../services/sessionsService";
import { generateToken } from "../utils/encryption/jwt";
import * as UserDB from "../../db/usersTable";
import createErrorApp from "../utils/creation/createError";
import { createUserObjWithGoogleOauth } from "../utils/creation/createUserObj";
import { env } from "process";

async function googleOauthHandler(req: Request, res: Response, next: NextFunction) {
    try {
        // get the id and access token with the code
        const code = req.query.code as string;
        const { id_token, access_token } = await sessionsService.getGoogleOauthTokens(code); // get the id access token

        // get user with tokens
        const googleUser = await sessionsService.getGoogleUser(id_token, access_token);

        // upsert the user
        let user = await UserDB.getUserByGoogleId(googleUser.id);
        if (user === null) {
            const newUser = createUserObjWithGoogleOauth(googleUser);
            await UserDB.createUser(newUser);

            const createdUser = await UserDB.getUserByEmail(newUser.email);
            if (!createdUser) createErrorApp("User creation failed", 500);

            user = createdUser;
        }

        // create access and refresh token
        const token = generateToken({
            user_id: user.user_id,
            role: user.role,
        });
        const { password, ...userWithoutPassword } = user;

        const url = process.env.FRONTEND_APP_URL + "/oauth/callback";
        const query = `?user=${encodeURIComponent(
            JSON.stringify(userWithoutPassword)
        )}&token=${token}`;

        res.redirect(url + query);
    } catch (error) {
        next(error);
    }
}

export default googleOauthHandler;
