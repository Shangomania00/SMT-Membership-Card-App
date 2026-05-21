import { eq, desc } from "drizzle-orm";
import { getDb } from "./connection";
import { todos } from "@db/schema";

export async function findTodosByUser(userId: number) {
  return getDb()
    .select()
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(desc(todos.createdAt));
}

export async function findPendingTodosByUser(userId: number) {
  return getDb()
    .select()
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(desc(todos.createdAt));
}

export async function findTodoById(id: number, userId: number) {
  const rows = await getDb()
    .select()
    .from(todos)
    .where(eq(todos.id, id))
    .limit(1);
  const todo = rows.at(0);
  if (!todo || todo.userId !== userId) return null;
  return todo;
}

export async function createTodo(data: { title: string; durationMs: number; userId: number }) {
  const result = await getDb()
    .insert(todos)
    .values({
      title: data.title,
      durationMs: data.durationMs,
      userId: data.userId,
    })
    .$returningId();
  return result[0].id;
}

export async function deleteTodo(id: number) {
  await getDb()
    .delete(todos)
    .where(eq(todos.id, id));
}

export async function completeTodo(id: number) {
  await getDb()
    .update(todos)
    .set({ completedAt: new Date() })
    .where(eq(todos.id, id));
}

export async function uncompleteTodo(id: number) {
  await getDb()
    .update(todos)
    .set({ completedAt: null })
    .where(eq(todos.id, id));
}
