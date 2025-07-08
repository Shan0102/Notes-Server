import { GoogleUserInfo } from "../../types";
import createErrorApp from "../utils/creation/createError";
import qs from "qs";

async function getGoogleOauthTokens(code: string) {
    const url = "https://oauth2.googleapis.com/token";

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        grant_type: "authorization_code",
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: qs.stringify(values),
        });

        const data = response.json();

        return data;
    } catch (error) {
        createErrorApp("Failed to fetch tokens", 500);
    }
}

async function getGoogleUser(id_token: number, access_token: number): Promise<GoogleUserInfo> {
    const query = `?alt=json&access_token=${access_token}`;
    const url = "https://www.googleapis.com/oauth2/v1/userinfo" + query;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        });

        const data = await response.json();

        return data;
    } catch (error) {
        createErrorApp("Failed to fetch user from google", 500);
    }
}

export { getGoogleOauthTokens, getGoogleUser };
