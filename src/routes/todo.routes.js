import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createTodoSchema,
  todoIdSchema,
  updateTodoSchema,
} from "../schemas/request.schemas.js";

const router = express.Router();

router.use(protect);

router.post("/", validate(createTodoSchema), createTodo);
router.get("/", getTodos);
router.put(
  "/:id",
  validate(todoIdSchema, "params"),
  validate(updateTodoSchema),
  updateTodo,
);
router.delete("/:id", validate(todoIdSchema, "params"), deleteTodo);

export default router;
