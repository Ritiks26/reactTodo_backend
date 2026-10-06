import { db } from "../db/index.js";
import { todos } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const [newTodo] = await db
      .insert(todos)
      .values({
        userId: req.user.id,
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
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
    const { title, description, completed, priority, dueDate } = req.body;
    const [updateTodo] = await db
      .update(todos)
      .set({
        title,
        description,
        completed,
        priority,
        dueDate,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, Number(id)), eq(todos.userId, req.user.id)))
      .returning();

    if (!updateTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo updated", todo: updateTodo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const [deleteTodo] = await db
      .delete(todos)
      .where(and(eq(todos.id, Number(id)), eq(todos.userId, req.user.id)))
      .returning();

    if (!deleteTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
