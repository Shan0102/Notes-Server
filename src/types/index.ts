interface User {
    user_id: number;
    name: string;
    username: string; // unique
    email: string;
    password: string; // bcrypt password
    google_id?: string; // unique
    created_at: Date;
}

type RecievedUser = Omit<User, "user_id" | "created_at"> & {
    password: string; // plain text password
};

interface AppError extends Error {
    status?: number;
}

interface JwtPayload {
    user_id: number;
    role?: string;
}

export { User, AppError, RecievedUser, JwtPayload };
