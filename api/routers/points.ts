import { z } from "zod";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import { createRouter, staffQuery } from "../middleware";
import { getDb } from "@db/queries/connection";
import { members, transactions } from "@db/schema";

const REWARD_THRESHOLD = 10;

export const pointsRouter = createRouter({
  issue: staffQuery
    .input(
      z.object({
        memberId: z.string(),
        points: z.number().min(1).max(100),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // Find member
      const [member] = await db
        .select()
        .from(members)
        .where(eq(members.memberId, input.memberId))
        .limit(1);

      if (!member) {
        throw new Error("Member not found");
      }

      const newStamps = member.stamps + input.points;
      const newTotal = member.totalStampsEarned + input.points;

      // Update member stamps
      await db
        .update(members)
        .set({
          stamps: newStamps,
          totalStampsEarned: newTotal,
          updatedAt: new Date(),
        })
        .where(eq(members.id, member.id));

      // Create transaction
      const [txn] = await db
        .insert(transactions)
        .values({
          memberId: member.id,
          type: "stamp",
          points: input.points,
          description: input.description || `Added ${input.points} stamp(s)`,
          issuedBy: ctx.user?.id ?? null,
        });

      // Check reward threshold
      const rewardsEarned = Math.floor(newStamps / REWARD_THRESHOLD);
      const previousRewards = Math.floor(member.stamps / REWARD_THRESHOLD);
      const newRewards = rewardsEarned - previousRewards;

      let rewardTransaction = null;
      if (newRewards > 0) {
        // Create reward transaction
        const [rewardTxn] = await db
          .insert(transactions)
          .values({
            memberId: member.id,
            type: "reward",
            points: -REWARD_THRESHOLD * newRewards,
            description: `Reward unlocked! ${newRewards}x reward redeemed`,
            issuedBy: ctx.user?.id ?? null,
          });

        await db
          .update(members)
          .set({
            stamps: newStamps % REWARD_THRESHOLD,
            rewardsRedeemed: member.rewardsRedeemed + newRewards,
            updatedAt: new Date(),
          })
          .where(eq(members.id, member.id));

        rewardTransaction = rewardTxn;
      }

      return {
        member: {
          id: member.id,
          memberId: member.memberId,
          stamps: newStamps % REWARD_THRESHOLD,
          totalStampsEarned: newTotal,
          rewardsRedeemed: member.rewardsRedeemed + (newRewards > 0 ? newRewards : 0),
        },
        transaction: {
          id: txn.insertId,
          type: "stamp" as const,
          points: input.points,
          description: input.description || `Added ${input.points} stamp(s)`,
        },
        rewardUnlocked: newRewards > 0,
        rewardTransaction,
      };
    }),

  history: staffQuery
    .input(
      z.object({
        memberId: z.string(),
        limit: z.number().default(50),
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
        .from(transactions)
        .where(eq(transactions.memberId, member.id))
        .orderBy(desc(transactions.createdAt))
        .limit(input.limit);
    }),

  stats: staffQuery.query(async () => {
    const db = getDb();

    const totalMembersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(members);

    const activeCardsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(members)
      .where(sql`${members.stamps} > 0`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stampsTodayResult = await db
      .select({ total: sql<number>`COALESCE(SUM(points), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.type, "stamp"),
          gte(transactions.createdAt, today)
        )
      );

    const totalStampsResult = await db
      .select({ total: sql<number>`COALESCE(SUM(points), 0)` })
      .from(transactions)
      .where(eq(transactions.type, "stamp"));

    const rewardsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(eq(transactions.type, "reward"));

    return {
      totalMembers: totalMembersResult[0]?.count ?? 0,
      activeCards: activeCardsResult[0]?.count ?? 0,
      stampsToday: Number(stampsTodayResult[0]?.total ?? 0),
      totalStamps: Number(totalStampsResult[0]?.total ?? 0),
      rewardsRedeemed: rewardsResult[0]?.count ?? 0,
    };
  }),
});
