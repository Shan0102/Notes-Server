import express from "express";
import {
    createNote,
    getAllNotesForUserId,
    getNoteById,
    updateNote,
    deleteNote,
} from "../controllers/notesController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware); // Apply auth middleware to all routes

router.post("/", createNote); // Create a new note
router.get("/user/:user_id", getAllNotesForUserId); // Get all notes for a specific user
router.get("/:note_id", getNoteById); // Get a specific note by ID
router.put("/:note_id", updateNote); // Update a specific note by ID
router.delete("/:note_id", deleteNote); // Delete a specific note by ID

export default router;
