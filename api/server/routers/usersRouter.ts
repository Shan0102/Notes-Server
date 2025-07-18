import express from "express";
import {
    createUser,
    deleteUser,
    loginUser,
    updateUserInfo,
    updateUserPassword,
} from "../controllers/usersController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.delete("/:user_id", authMiddleware, deleteUser);
router.put("/info/:user_id", authMiddleware, updateUserInfo);
router.put("/password/:user_id", authMiddleware, updateUserPassword);

export default router;
