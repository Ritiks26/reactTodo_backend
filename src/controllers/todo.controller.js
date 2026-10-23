import { db } from "../db/index.js";
import { todos } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const [newTodo] = await db
      .insert(todos)
      .values({
        userId: req.user.id,
        title,
        description,
        priority,
        dueDate: dueDate ?? null,
      })
      .returning();

    res.status(201).json({ message: "Todo created", todo: newTodo });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
};

export const getTodos = async (req, res) => {
  try {
    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, req.user.id));
    res.json({ todos: userTodos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedTodo] = await db
      .update(todos)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, id), eq(todos.userId, req.user.id)))
      .returning();

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo updated", todo: updatedTodo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const [deletedTodo] = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, req.user.id)))
      .returning();

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
