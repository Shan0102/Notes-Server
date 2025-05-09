import { RecievedUser } from "../../../types";
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

export default createUserObj;
