import { z } from "zod";
import { eq, like, or, sql, desc } from "drizzle-orm";
import { createRouter, publicQuery, staffQuery } from "../middleware";
import { getDb } from "../../api/queries/connection";
import { members, transactions } from "@db/schema";

// Helper to generate unique member ID
async function generateMemberId(): Promise<string> {
  const db = getDb();
  const year = new Date().getFullYear();
  const prefix = `SMT-${year}-`;

  // Get the highest sequential number for this year
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(members)
    .where(like(members.memberId, `${prefix}%`));

  const count = result[0]?.count ?? 0;
  const nextNum = count + 1;
  return `${prefix}${String(nextNum).padStart(4, "0")}`;
}

export const memberRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        fullName: z.string().min(2).max(100),
        phone: z.string().min(8).max(20),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const memberId = await generateMemberId();
      const barcode = `SMT${memberId}`;

      const [member] = await db
        .insert(members)
        .values({
          memberId,
          fullName: input.fullName,
          phone: input.phone,
          email: input.email || null,
          barcode,
          stamps: 1, // Welcome bonus
          totalStampsEarned: 1,
        });

      // Create welcome bonus transaction
      await db.insert(transactions).values({
        memberId: member.insertId,
        type: "bonus",
        points: 1,
        description: "Welcome bonus stamp!",
      });

      return {
        id: member.insertId,
        memberId,
        fullName: input.fullName,
        phone: input.phone,
        email: input.email || null,
        barcode,
        stamps: 1,
      };
    }),

  getById: publicQuery
    .input(z.object({ memberId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [member] = await db
        .select()
        .from(members)
        .where(eq(members.memberId, input.memberId))
        .limit(1);

      if (!member) return null;

      const txns = await db
        .select()
        .from(transactions)
        .where(eq(transactions.memberId, member.id))
        .orderBy(desc(transactions.createdAt))
        .limit(10);

      return { ...member, transactions: txns };
    }),

  getByBarcode: publicQuery
    .input(z.object({ barcode: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [member] = await db
        .select()
        .from(members)
        .where(eq(members.barcode, input.barcode))
        .limit(1);

      if (!member) return null;

      const txns = await db
        .select()
        .from(transactions)
        .where(eq(transactions.memberId, member.id))
        .orderBy(desc(transactions.createdAt))
        .limit(10);

      return { ...member, transactions: txns };
    }),

  list: staffQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(10),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const offset = (page - 1) * limit;

      let query;
      if (input?.search) {
        const searchTerm = `%${input.search}%`;
        query = db
          .select()
          .from(members)
          .where(
            or(
              like(members.fullName, searchTerm),
              like(members.phone, searchTerm),
              like(members.memberId, searchTerm)
            )
          )
          .orderBy(desc(members.createdAt))
          .limit(limit)
          .offset(offset);
      } else {
        query = db
          .select()
          .from(members)
          .orderBy(desc(members.createdAt))
          .limit(limit)
          .offset(offset);
      }

      const memberList = await query;

      // Get total count
      const countResult = input?.search
        ? await db
            .select({ count: sql<number>`count(*)` })
            .from(members)
            .where(
              or(
                like(members.fullName, `%${input.search}%`),
                like(members.phone, `%${input.search}%`),
                like(members.memberId, `%${input.search}%`)
              )
            )
        : await db.select({ count: sql<number>`count(*)` }).from(members);

      const total = countResult[0]?.count ?? 0;

      return {
        total,
        members: memberList,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),
});



