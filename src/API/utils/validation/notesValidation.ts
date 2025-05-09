import { RecievedNote } from "../../../types";
import createErrorApp from "../creation/createError";

function validateNote(note: unknown): asserts note is RecievedNote {
    if (!note || typeof note !== "object") {
        createErrorApp("Invalid note: Note must be an object.", 400);
    }

    if (!("title" in note)) createErrorApp("Invalid note: Title is required.", 400);
    if (!("content" in note)) createErrorApp("Invalid note: Content is required.", 400);
    if (!("completed" in note)) createErrorApp("Invalid note: Completed status is required.", 400);

    validateTitle(note.title);
    validateContent(note.content);
    validateCompleted(note.completed);
}

function validateTitle(title: unknown): void {
    if (!title || typeof title !== "string") {
        createErrorApp("Invalid title: Title is required and must be a string.", 400);
    }
    if (title.length > 255) {
        createErrorApp("Invalid title: Title's max length is 255 characters.", 400);
    }
}

function validateContent(content: unknown): void {
    if (!content || typeof content !== "string") {
        createErrorApp("Invalid content: Content is required and must be a string.", 400);
    }
    if (content.length > 10000) {
        createErrorApp("Invalid content: Content's max length is 10000 characters.", 400);
    }
}

function validateCompleted(completed: unknown): void {
    if (!completed || typeof completed !== "boolean") {
        createErrorApp("Invalid content: Content is required and must be a boolean.", 400);
    }
}

export default validateNote;
