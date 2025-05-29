import * as NoteDB from "../../db/notesTable";
import * as UserDB from "../../db/usersTable";
import { Note, JwtPayload } from "../../types/index";
import createErrorApp from "../utils/creation/createError";
import validateNote from "../utils/validation/notesValidation";
import createdNoteObj from "../utils/creation/createNoteObj";
import { checkId } from "../utils/validation/usersValidation";

const MAX_MEMORY_USAGE = 1000 * 1000 * 4.5; // bytes // 4.5mbyte

async function createNote(note: unknown, userInfo: JwtPayload | undefined): Promise<Note> {
    console.log(note);
    validateNote(note);
    const newNote = createdNoteObj(note);

    if (!userInfo) createErrorApp("Unauthorized", 401);
    const user = await UserDB.getUserById(userInfo.user_id);

    if (!user) createErrorApp("User not found", 404);
    if (user.memory_usage > MAX_MEMORY_USAGE) {
        createErrorApp("User achieve the max available space for this account", 401);
    }

    const note_id = await NoteDB.createNote({ ...newNote, user_id: userInfo.user_id });
    const createdNote: Note | null = await NoteDB.getNoteById(note_id);

    if (!createdNote) createErrorApp("Note creation failed", 500);

    return createdNote;
}

async function getAllNotesForUserId(
    user_id: string,
    userInfo: JwtPayload | undefined
): Promise<Note[]> {
    const id = parseInt(user_id, 10);
    checkId(id);

    if (!userInfo) createErrorApp("Unauthorized", 401);
    if (id !== userInfo.user_id && userInfo.role !== "_admin") {
        createErrorApp("Unauthorized", 403);
    }

    const user = await UserDB.getUserById(id);
    if (!user) createErrorApp("User not found", 404);

    const notes: Note[] | null = await NoteDB.getAllNotesForUserId(id);
    if (!notes) return [];

    return notes;
}

async function getNoteById(note_id: string, userInfo: JwtPayload | undefined): Promise<Note> {
    const id = parseInt(note_id, 10);
    checkId(id);

    if (!userInfo) createErrorApp("Unauthorized", 401);

    const note: Note | null = await NoteDB.getNoteById(id);
    if (!note) createErrorApp("Note not found", 404);

    if (note.user_id !== userInfo.user_id && userInfo.role !== "_admin") {
        createErrorApp("Unauthorized", 403);
    }

    return note;
}

async function updateNote(
    note_id: string,
    note: unknown,
    userInfo: JwtPayload | undefined
): Promise<Note> {
    const id = parseInt(note_id, 10);
    checkId(id);

    if (!userInfo) createErrorApp("Unauthorized", 401);
    const user = await UserDB.getUserById(userInfo.user_id);

    if (!user) createErrorApp("User not found", 404);
    if (user.memory_usage > MAX_MEMORY_USAGE) {
        createErrorApp("User achieve the max available space for this account", 401);
    }

    const noteToUpdate: Note | null = await NoteDB.getNoteById(id);
    if (!noteToUpdate) createErrorApp("Note not found", 404);

    if (noteToUpdate.user_id !== userInfo.user_id && userInfo.role !== "_admin") {
        createErrorApp("Unauthorized", 403);
    }

    validateNote(note);
    const updatedNote = createdNoteObj(note);

    await NoteDB.updateNote(id, updatedNote);
    const updatedNoteFromDB: Note | null = await NoteDB.getNoteById(id);

    if (!updatedNoteFromDB) createErrorApp("Note update failed", 500);

    return updatedNoteFromDB;
}

async function deleteNote(note_id: string, userInfo: JwtPayload | undefined): Promise<void> {
    const id = parseInt(note_id, 10);
    checkId(id);

    if (!userInfo) createErrorApp("Unauthorized", 401);

    const noteToDelete: Note | null = await NoteDB.getNoteById(id);
    if (!noteToDelete) createErrorApp("Note not found", 404);

    if (noteToDelete.user_id !== userInfo.user_id && userInfo.role !== "_admin") {
        createErrorApp("Unauthorized", 403);
    }

    await NoteDB.deleteNote(id);

    const deletedNote: Note | null = await NoteDB.getNoteById(id);
    if (deletedNote) createErrorApp("Note deletion failed", 500);
}

export { createNote, getAllNotesForUserId, getNoteById, updateNote, deleteNote };
