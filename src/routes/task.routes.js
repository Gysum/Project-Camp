import { Router } from "express";
import {
  getTasks,
  createTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/task.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/projects/:projectId/tasks").get(getTasks).post(createTasks);

router
  .route("/projects/:projectId/tasks/:taskId")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.route("/projects/:projectId/tasks/:taskId/subtasks").post(createSubTask);

router
  .route("/projects/:projectId/tasks/:taskId/subtasks/:subTaskId")
  .put(updateSubTask)
  .delete(deleteSubTask);

export default router;
