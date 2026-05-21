import { relations } from "drizzle-orm";
import { users, members, transactions, notifications } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  notifications: many(notifications),
}));

export const membersRelations = relations(members, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  member: one(members, {
    fields: [transactions.memberId],
    references: [members.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  sender: one(users, {
    fields: [notifications.sentBy],
    references: [users.id],
  }),
  member: one(members, {
    fields: [notifications.targetMemberId],
    references: [members.id],
  }),
}));



