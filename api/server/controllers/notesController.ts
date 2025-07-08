import { Request, Response, NextFunction } from "express";
import * as noteService from "../services/notesService";

async function createNote(req: Request, res: Response, next: NextFunction) {
    try {
        const note = await noteService.createNote(req.body, req.user);
        res.status(201).json(note);
    } catch (error) {
        next(error);
    }
}

async function getAllNotesForUserId(req: Request, res: Response, next: NextFunction) {
    try {
        const notes = await noteService.getAllNotesForUserId(req.params.user_id, req.user);
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

async function getNoteById(req: Request, res: Response, next: NextFunction) {
    try {
        const note = await noteService.getNoteById(req.params.note_id, req.user);
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}

async function updateNote(req: Request, res: Response, next: NextFunction) {
    try {
        const note = await noteService.updateNote(req.params.note_id, req.body, req.user);
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}
async function deleteNote(req: Request, res: Response, next: NextFunction) {
    try {
        await noteService.deleteNote(req.params.note_id, req.user);
        res.status(204).json({ message: "Note deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export { createNote, getAllNotesForUserId, getNoteById, updateNote, deleteNote };
