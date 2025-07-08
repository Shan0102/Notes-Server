import { UserInfoBody } from "../../../types";
import createErrorApp from "../creation/createError";
import { validateName } from "./usersValidation";

function validateUserInfoBody(userInfoBody: unknown): asserts userInfoBody is UserInfoBody {
    if (!userInfoBody || typeof userInfoBody !== "object") {
        createErrorApp("Invalid Data: Data must be an object.", 400);
    }

    if (!("name" in userInfoBody)) createErrorApp("Invalid user: Name is required.", 400);
    if (!("username" in userInfoBody))
        createErrorApp("Invalid username: Username is required.", 400);

    validateName(userInfoBody.name);
    validateName(userInfoBody.username);
}

export { validateUserInfoBody };
