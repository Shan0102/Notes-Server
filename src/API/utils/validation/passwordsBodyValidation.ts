import { PasswordsBody } from "../../../types";
import createErrorApp from "../creation/createError";
import { validatePassword } from "./usersValidation";

function validatePasswordsBody(passwordsBody: unknown): asserts passwordsBody is PasswordsBody {
    if (!passwordsBody || typeof passwordsBody !== "object") {
        createErrorApp("Invalid passwordsBody: PasswordsBody must be an object.", 400);
    }

    if (!("prevPassword" in passwordsBody))
        createErrorApp("Invalid prevPassword: PrevPassword is required.", 400);
    if (!("newPassword" in passwordsBody))
        createErrorApp("Invalid newPassword: NewPassword is required.", 400);

    if (typeof passwordsBody.prevPassword !== "string") {
        createErrorApp("Invalid prevPassword: PrevPassword must be a string.", 400);
    }

    validatePassword(passwordsBody.newPassword);
}

export { validatePasswordsBody };
