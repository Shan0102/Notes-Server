import { PasswordsBody } from "../../../types";
import createErrorApp from "../creation/createError";
import { validatePassword } from "./usersValidation";

function validatePasswordsBody(passwordsBody: unknown): asserts passwordsBody is PasswordsBody {
    if (!passwordsBody || typeof passwordsBody !== "object") {
        createErrorApp("Invalid passwordsBody: PasswordsBody must be an object.", 400);
    }

    if (!("prev_password" in passwordsBody))
        createErrorApp("Invalid prevPassword: Prev_password is required.", 400);
    if (!("new_password" in passwordsBody))
        createErrorApp("Invalid newPassword: New_password is required.", 400);

    if (typeof passwordsBody.prev_password !== "string") {
        createErrorApp("Invalid prevPassword: Prev_password must be a string.", 400);
    }

    validatePassword(passwordsBody.new_password);
}

export { validatePasswordsBody };
