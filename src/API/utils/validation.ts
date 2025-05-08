import { RecievedUser } from "../../types";
import createErrorApp from "./createError";

function validateUser(user: RecievedUser): void {
    validateName(user.name);
    validateUsername(user.username);
    validatePassword(user.password);
    validateEmail(user.email);
}

function validateName(name: string): void {
    if (!name || typeof name !== "string") {
        createErrorApp("Invalid name: Name is required and must be a string.", 400);
    }
    if (name.length < 3 || name.length > 30) {
        createErrorApp("Invalid name: Name must be between 3 and 30 characters long.", 400);
    }
}

function validateUsername(username: string): void {
    if (!username || typeof username !== "string") {
        createErrorApp("Invalid username: Username is required and must be a string.", 400);
    }
    if (username.length < 3 || username.length > 30) {
        createErrorApp("Invalid username: Username must be between 3 and 30 characters long.", 400);
    }
}

function validatePassword(password: string): void {
    if (!password || typeof password !== "string") {
        createErrorApp("Invalid password: Password is required and must be a string.", 400);
    }
    if (password.length < 8 || password.length > 255) {
        createErrorApp(
            "Invalid password: Password must be between 8 and 255 characters long.",
            400
        );
    }
    const regex =
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]).+$/;
    if (!regex.test(password)) {
        createErrorApp(
            "Invalid password: Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            400
        );
    }
}

function validateEmail(email: string): void {
    if (!email || typeof email !== "string") {
        createErrorApp("Invalid email: Email is required and must be a string.", 400);
    }

    if (!isEmail(email)) {
        createErrorApp("Invalid email: Email format is invalid.", 400);
    }
}

function isEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function checkId(id: number): void {
    if (isNaN(id) || id <= 0) {
        return createErrorApp("Invalid ID: ID must be a positive number.", 400);
    }
    if (!Number.isInteger(id)) {
        return createErrorApp("Invalid ID: ID must be an integer.", 400);
    }
}

export { isEmail, checkId };
export default validateUser;
