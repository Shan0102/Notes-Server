import express from "express";
import { createUser, deleteUser, loginUser } from "../controllers/usersController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.delete("/:user_id", authMiddleware, deleteUser);

export default router;
