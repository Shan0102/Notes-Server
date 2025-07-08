import { RecievedNote } from "../../../types";

function createdNoteObj(note: RecievedNote): RecievedNote {
    const newNote = {
        title: note.title,
        content: note.content,
        completed: note.completed,
    };
    return newNote;
}

export default createdNoteObj;
