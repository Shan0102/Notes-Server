interface User {
    user_id: number;
    name: string;
    username: string; // unique
    email: string;
    password: string; // bcrypt password
    google_id: string | null; // unique
    role: string;
    memory_usage: number; // bytes
    created_at: Date;
}

type UserWithoutPassword = Omit<User, "password">;
type RecievedUser = Omit<User, "user_id" | "created_at" | "role" | "memory_usage"> & {
    password: string; // plain text password
};

interface LoginBody {
    dataType: "email" | "username";
    data: "string";
    password: string;
}

interface UserInfoBody {
    name: string;
    username: string;
}

interface PasswordsBody {
    prevPassword: string;
    newPassword: string;
}

interface Note {
    note_id: number;
    user_id: number;
    title: string;
    content: string;
    completed: boolean;
    updated_at: Date;
    created_at: Date;
}

type RecievedNoteFromAPI = Omit<Note, "created_at" | "note_id" | "updated_at">;
type RecievedNote = Omit<Note, "created_at" | "note_id" | "user_id" | "updated_at">;

interface AppError extends Error {
    status?: number;
}

interface JwtPayload {
    user_id: number;
    role: string;
}

interface GoogleDataDecoded {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    iat: number;
    exp: number;
}

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    picture: string;
}

export {
    AppError,
    JwtPayload,
    User,
    UserWithoutPassword,
    RecievedUser,
    LoginBody,
    UserInfoBody,
    PasswordsBody,
    Note,
    RecievedNote,
    RecievedNoteFromAPI,
    GoogleDataDecoded,
    GoogleUserInfo,
};
