import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, staffQuery, publicQuery } from "../middleware";
import { getDb } from "@db/queries/connection";
import { notifications, members } from "@db/schema";

export const notificationRouter = createRouter({
  send: staffQuery
    .input(
      z.object({
        title: z.string().min(1).max(100),
        message: z.string().min(1).max(500),
        target: z.enum(["all", "member"]),
        targetMemberId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      let targetMemberDbId: number | undefined;

      if (input.target === "member" && input.targetMemberId) {
        const [member] = await db
          .select()
          .from(members)
          .where(eq(members.memberId, input.targetMemberId))
          .limit(1);

        if (member) {
          targetMemberDbId = member.id;
        }
      }

      const [notif] = await db
        .insert(notifications)
        .values({
          title: input.title,
          message: input.message,
          target: input.target,
          targetMemberId: targetMemberDbId ?? null,
          sentBy: ctx.user?.id ?? 0,
          status: "sent",
        });

      return {
        id: notif.insertId,
        title: input.title,
        message: input.message,
        target: input.target,
        status: "sent" as const,
        createdAt: new Date(),
      };
    }),

  list: staffQuery
    .input(
      z
        .object({
          limit: z.number().default(20),
          page: z.number().default(1),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      const notifs = await db
        .select({
          id: notifications.id,
          title: notifications.title,
          message: notifications.message,
          target: notifications.target,
          status: notifications.status,
          createdAt: notifications.createdAt,
        })
        .from(notifications)
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(notifications);

      const total = countResult[0]?.count ?? 0;

      return {
        notifications: notifs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  history: publicQuery
    .input(
      z.object({
        memberId: z.string(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();

      const [member] = await db
        .select()
        .from(members)
        .where(eq(members.memberId, input.memberId))
        .limit(1);

      if (!member) return [];

      return db
        .select()
        .from(notifications)
        .where(
          sql`${notifications.target} = 'all' OR ${notifications.targetMemberId} = ${member.id}`
        )
        .orderBy(desc(notifications.createdAt))
        .limit(input.limit);
    }),
});
