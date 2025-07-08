import { LoginBody } from "../../../types";
import createErrorApp from "../creation/createError";

function validateLoginBody(loginBody: unknown): asserts loginBody is LoginBody {
    if (!loginBody || typeof loginBody !== "object") {
        createErrorApp("Invalid user: User must be an object.", 400);
    }

    if (!("dataType" in loginBody)) createErrorApp("Invalid dataType: DataType is required.", 400);
    if (!("data" in loginBody)) createErrorApp("Invalid data: Data is required.", 400);
    if (!("password" in loginBody)) createErrorApp("Invalid password: Password is required.", 400);

    validateDataType(loginBody.dataType);
    validateData(loginBody.data);
    validatePassword(loginBody.password);
}

function validateDataType(dataType: unknown): void {
    if (!dataType || typeof dataType !== "string") {
        createErrorApp("Invalid dataType: DataType is required and must be a string.", 400);
    }
    if (dataType !== "email" && dataType !== "username") {
        createErrorApp("Invalid dataType: DataType must be either 'email' or 'username'.", 400);
    }
}

function validateData(data: unknown): void {
    if (!data || typeof data !== "string") {
        createErrorApp("Invalid data: Data is required and must be a string.", 400);
    }
}

function validatePassword(password: unknown): void {
    if (!password || typeof password !== "string") {
        createErrorApp("Invalid password: Password is required and must be a string.", 400);
    }
    if (password.length < 1) {
        createErrorApp("Invalid password: Password is required.", 400);
    }
}

export default validateLoginBody;
