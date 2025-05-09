import mysql from "mysql2";
import pool from "./utils/pool.js";
import { tryCatchWrapper } from "./utils/tryCatch.js";
import { Note, RecievedNote, RecievedNoteFromAPI } from "../types/index.js";

const ensureNotesTableExists = tryCatchWrapper(async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS notes (
            note_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            content VARCHAR(10000) NOT NULL,
            completed BOOL NOT NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );`;
    await pool.query(createTableQuery);
    console.log(`[${new Date().toLocaleString()}]:Notes table checked/created successfully.`);
});

const createNote = tryCatchWrapper(async (note: RecievedNoteFromAPI): Promise<number> => {
    const values = [note.user_id, note.title, note.content, note.completed];
    const query = `INSERT INTO notes (user_id, title, content, completed) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.query(query, values);

    const createdResult = result as mysql.ResultSetHeader;
    console.log(`[${new Date().toLocaleString()}]:Note created successfully:`, result);
    return createdResult.insertId;
});

const getAllNotesForUserId = tryCatchWrapper(async (user_id: number): Promise<Note[] | null> => {
    const query = `SELECT * FROM notes WHERE user_id = ?`;
    const rows = await pool.query(query, [user_id]);
    const notes = rows[0] as Note[];

    if (notes.length === 0) {
        return null;
    }

    console.log(`[${new Date().toLocaleString()}]:Notes retrieved successfully:`, notes[0]);
    return notes;
});

const getNoteById = tryCatchWrapper(async (note_id: number): Promise<Note | null> => {
    const query = `SELECT * FROM notes WHERE note_id = ?`;
    const rows = await pool.query(query, [note_id]);
    const notes = rows[0] as Note[];

    if (notes.length === 0) {
        return null;
    }

    console.log(`[${new Date().toLocaleString()}]:Note retrieved successfully:`, notes[0]);
    return notes[0];
});

const updateNote = tryCatchWrapper(async (note_id: number, note: RecievedNote): Promise<void> => {
    const values = [note.title, note.content, note.completed, note_id];
    const query = `UPDATE notes SET title = ?, content = ?, completed = ? WHERE note_id = ?`;
    const [result] = await pool.query(query, values);

    const updatedResult = result as mysql.ResultSetHeader;
    if (updatedResult.affectedRows === 0) {
        throw new Error(`Note with ID ${note_id} not found`);
    }

    console.log(`[${new Date().toLocaleString()}]:Note updated successfully:`, updatedResult);
});

const deleteNote = tryCatchWrapper(async (note_id: number): Promise<void> => {
    const query = `DELETE FROM notes WHERE note_id = ?`;
    const [result] = await pool.query(query, [note_id]);

    const deletedResult = result as mysql.ResultSetHeader;
    if (deletedResult.affectedRows === 0) {
        throw new Error(`Note with ID ${note_id} not found`);
    }

    console.log(`[${new Date().toLocaleString()}]:Note deleted successfully:`, deletedResult);
});

export {
    ensureNotesTableExists,
    createNote,
    getNoteById,
    getAllNotesForUserId,
    updateNote,
    deleteNote,
};
