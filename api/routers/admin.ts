import { desc, sql } from "drizzle-orm";
import { createRouter, staffQuery } from "../middleware";
import { getDb } from "../../api/queries/connection";
import { members, transactions, notifications } from "@db/schema";

export const adminRouter = createRouter({
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

    const totalStampsResult = await db
      .select({ total: sql<number>`COALESCE(SUM(points), 0)` })
      .from(transactions)
      .where(sql`${transactions.type} = 'stamp'`);

    const rewardsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(sql`${transactions.type} = 'reward'`);

    const notifCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications);

    return {
      totalMembers: totalMembersResult[0]?.count ?? 0,
      activeCards: activeCardsResult[0]?.count ?? 0,
      totalStamps: Number(totalStampsResult[0]?.total ?? 0),
      rewardsRedeemed: rewardsResult[0]?.count ?? 0,
      totalNotifications: notifCountResult[0]?.count ?? 0,
    };
  }),

  recentActivity: staffQuery.query(async () => {
    const db = getDb();

    const recentTxns = await db
      .select({
        id: transactions.id,
        memberName: members.fullName,
        type: transactions.type,
        points: transactions.points,
        description: transactions.description,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .innerJoin(members, sql`${transactions.memberId} = ${members.id}`)
      .orderBy(desc(transactions.createdAt))
      .limit(20);

    return recentTxns;
  }),
});



