# Notes Server

A RESTful API server for a note-taking application, built with Node.js, TypeScript, and Express. Supports user authentication (including Google OAuth), note management, and user profile features. Designed to work seamlessly with the [React App Notes frontend](https://github.com/Shan0102/Notes-React).

## Features

-   User authentication (username/email & password, Google OAuth)
-   Create, edit, and delete notes
-   User profile management (update name, username, password)
-   Per-user memory usage tracking and limits
-   Secure password hashing with bcrypt
-   JWT-based authentication and authorization
-   Error handling and validation
-   CORS support for frontend integration

## Tech Stack

-   **Backend:** Node.js, TypeScript, Express
-   **Database:** MySQL (via mysql2)
-   **Authentication:** JWT, bcrypt, Google OAuth
-   **Environment:** dotenv for configuration

## Configuration

-   **Environment Variables:**
    -   Copy `.env.example` to `.env` and fill in your database, JWT, and OAuth credentials.
    -   See [https://console.cloud.google.com/apis/credentials] and create your own credentials.
    -   Make sure your MySQL server is running and accessible from your backend.
-   **Frontend:**
    -   Designed to work with [Notes React App](https://github.com/Shan0102/Notes-React).
    -   Set `FRONTEND_APP_URL` to your frontend's URL.

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Shan0102/Notes-Server.git
    cd Notes-Server
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up environment variables:**

    - Copy `.env.example` to `.env` and edit as needed.

4. **Build the project:**

    ```sh
    npm run build
    ```

5. **Start the server:**
    ```sh
    npm start
    ```

## API Endpoints

-   `POST /api/users` — Register a new user
-   `POST /api/users/login` — Login with username/email and password
-   `PUT /api/users/info/:user_id` — Update user info (auth required)
-   `PUT /api/users/password/:user_id` — Change password (auth required)
-   `DELETE /api/users/:user_id` — Delete user (auth required)
-   `POST /api/notes` — Create a note (auth required)
-   `GET /api/notes/user/:user_id` — Get all notes for a user (auth required)
-   `GET /api/notes/:note_id` — Get a note by ID (auth required)
-   `PUT /api/notes/:note_id` — Update a note (auth required)
-   `DELETE /api/notes/:note_id` — Delete a note (auth required)
-   `GET /api/sessions/oauth/google` — Google OAuth login

## Usage

-   Connect your frontend app to the API server at the configured URL.
-   Use the provided endpoints for user and note management.
-   Authenticate requests using JWT tokens returned on login or OAuth.

## License

This project is licensed under the MIT License.

## Contact

For questions or feedback, please contact [shandev01@proton.me].
