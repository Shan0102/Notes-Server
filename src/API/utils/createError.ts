import { AppError } from "../../types";

function createErrorApp(message: string, statusCode: number): never {
    const error: AppError = new Error(message) as AppError;
    error.status = statusCode;
    throw error;
}

export default createErrorApp;
