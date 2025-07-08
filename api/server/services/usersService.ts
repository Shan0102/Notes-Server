import * as UserDB from "../../db/usersTable";
import { JwtPayload, User, UserWithoutPassword } from "../../types/index";
import validateUser, { checkId } from "../utils/validation/usersValidation";
import createErrorApp from "../utils/creation/createError";

import { comparePassword, getHash } from "../utils/encryption/bcrypt";
import { generateToken } from "../utils/encryption/jwt";
import createUserObj from "../utils/creation/createUserObj";
import validateLoginBody from "../utils/validation/loginBodyValidation";
import { validateUserInfoBody } from "../utils/validation/userInfoBodyValidation";
import { validatePasswordsBody } from "../utils/validation/passwordsBodyValidation";

async function createUser(user: unknown): Promise<UserWithoutPassword> {
    validateUser(user);

    const existingEmail = await UserDB.getUserByEmail(user.email);
    const existingUsername = await UserDB.getUserByUsername(user.username);
    const existingGoogleId = await UserDB.getUserByGoogleId(user.google_id);

    if (existingEmail) createErrorApp("Email already exists", 409);
    if (existingUsername) createErrorApp("Username already exists", 409);
    if (existingGoogleId) createErrorApp("Google ID already exists", 409);

    const newUser = await createUserObj(user);
    await UserDB.createUser(newUser);

    const createdUser = await UserDB.getUserByEmail(user.email);
    if (!createdUser) createErrorApp("User creation failed", 500);

    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
}

async function loginUser(
    loginBody: unknown
): Promise<{ user: UserWithoutPassword; token: string }> {
    validateLoginBody(loginBody);
    const { data, password, dataType } = loginBody;

    let user: User | null = null;

    if (dataType === "email") user = await UserDB.getUserByEmail(data);
    else if (dataType === "username") user = await UserDB.getUserByUsername(data);

    if (!user) createErrorApp("Invalid username or password", 401);

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        createErrorApp("Invalid username or password", 401);
    }

    const token = generateToken({
        user_id: user.user_id,
        role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
}

async function deleteUser(user_id: string, userInfo: JwtPayload | undefined): Promise<void> {
    const id = parseInt(user_id, 10);
    checkId(id);

    const user: User | null = await UserDB.getUserById(id);
    if (!user) {
        createErrorApp("User not found", 404);
    }

    if (!userInfo) createErrorApp("Unauthorized", 401);
    if (userInfo.role !== "_admin" && userInfo.user_id !== id) {
        createErrorApp("Forbidden", 403);
    }

    await UserDB.deleteUser(id);
}

async function updateUserInfo(
    userInfoBody: unknown,
    user_id: string,
    userInfo: JwtPayload | undefined
): Promise<UserWithoutPassword> {
    validateUserInfoBody(userInfoBody);
    const { name, username } = userInfoBody;

    const id = parseInt(user_id, 10);
    checkId(id);

    const user: User | null = await UserDB.getUserById(id);
    if (!user) {
        createErrorApp("User not found", 404);
    }

    if (!userInfo) createErrorApp("Unauthorized", 401);
    if (userInfo.role !== "_admin" && userInfo.user_id !== id) {
        createErrorApp("Forbidden", 403);
    }

    const userWithThisUsername = await UserDB.getUserByUsername(username);
    if (userWithThisUsername) createErrorApp("Username is already in use", 409);

    await UserDB.updateUserInfo(id, { name, username });
    const updatedUser = await UserDB.getUserById(id);
    if (!updatedUser) createErrorApp("User update failed", 500);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
}

async function updateUserPassword(
    passwordsBody: unknown,
    user_id: string,
    userInfo: JwtPayload | undefined
): Promise<void> {
    validatePasswordsBody(passwordsBody);
    const { prev_password, new_password } = passwordsBody;

    const id = parseInt(user_id, 10);
    checkId(id);

    const user: User | null = await UserDB.getUserById(id);
    if (!user) {
        createErrorApp("User not found", 404);
    }

    if (!userInfo) createErrorApp("Unauthorized", 401);
    if (userInfo.role !== "_admin" && userInfo.user_id !== id) {
        createErrorApp("Forbidden", 403);
    }

    const isPasswordValid = await comparePassword(prev_password, user.password);
    if (!isPasswordValid) {
        createErrorApp("Incorrect password", 401);
    }
    const hashedPassword = await getHash(new_password);
    await UserDB.updateUserPassword(id, hashedPassword);

    const updatedUser = await UserDB.getUserById(id);
    if (!updatedUser) createErrorApp("Password update failed", 500);
}

export { createUser, loginUser, deleteUser, updateUserInfo, updateUserPassword };
