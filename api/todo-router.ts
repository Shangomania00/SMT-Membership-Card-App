import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findTodosByUser,
  createTodo as createTodoDb,
  deleteTodo,
  completeTodo as completeTodoDb,
  uncompleteTodo as uncompleteTodoDb,
} from "./queries/todos";

export const todoRouter = createRouter({
  list: authedQuery.query(({ ctx }) =>
    findTodosByUser(ctx.user.id),
  ),

  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        durationMs: z.number().positive("Duration must be positive"),
      }),
    )
    .mutation(({ ctx, input }) =>
      createTodoDb({ title: input.title, durationMs: input.durationMs, userId: ctx.user.id }),
    ),

  delete: authedQuery
    .input(z.object({ id: z.number().positive() }))
    .mutation(({ input }) =>
      deleteTodo(input.id),
    ),

  complete: authedQuery
    .input(z.object({ id: z.number().positive() }))
    .mutation(({ input }) =>
      completeTodoDb(input.id),
    ),

  uncomplete: authedQuery
    .input(z.object({ id: z.number().positive() }))
    .mutation(({ input }) =>
      uncompleteTodoDb(input.id),
    ),
});
