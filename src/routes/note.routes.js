import { Router } from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Secure all note routes with JWT verification
router.use(verifyJWT);

// Create and Get notes under a specific project (validating project membership)
router
  .route("/projects/:projectId")
  .post(validateProjectPermission([]), createNote)
  .get(validateProjectPermission([]), getNotes);

// Update and Delete individual notes (authorization checks are inside the controllers)
router
  .route("/:noteId")
  .put(updateNote)
  .delete(deleteNote);

export default router;
