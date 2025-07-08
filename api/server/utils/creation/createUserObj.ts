import { GoogleUserInfo, RecievedUser } from "../../../types";
import { getHash } from "../encryption/bcrypt";

async function createUserObj(user: RecievedUser): Promise<RecievedUser> {
    const hashedPassword = await getHash(user.password);

    const newUser: RecievedUser = {
        name: user.name.trim(),
        username: user.username.trim(),
        email: user.email,
        google_id: user.google_id,
        password: hashedPassword,
    };

    return newUser;
}

function createUserObjWithGoogleOauth(googleUser: GoogleUserInfo): RecievedUser {
    const newUser: RecievedUser = {
        name: googleUser.name.trim(),
        username: googleUser.name.trim(),
        email: googleUser.email,
        google_id: googleUser.id,
        password: "",
    };

    return newUser;
}

export default createUserObj;
export { createUserObjWithGoogleOauth };
