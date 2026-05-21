import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Loyalty members - public signup (no auth required)
export const members = mysqlTable(
  "members",
  {
    id: serial("id").primaryKey(),
    memberId: varchar("memberId", { length: 20 }).notNull().unique(),
    fullName: varchar("fullName", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull().unique(),
    email: varchar("email", { length: 100 }),
    stamps: int("stamps").notNull().default(0),
    totalStampsEarned: int("totalStampsEarned").notNull().default(0),
    rewardsRedeemed: int("rewardsRedeemed").notNull().default(0),
    barcode: varchar("barcode", { length: 50 }).notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("stamps_idx").on(table.stamps),
    uniqueIndex("phone_idx").on(table.phone),
  ]
);

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

// Transactions - stamp/point history
export const transactions = mysqlTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    memberId: bigint("memberId", { mode: "number", unsigned: true }).notNull(),
    type: mysqlEnum("type", ["stamp", "reward", "bonus", "adjustment"])
      .notNull()
      .default("stamp"),
    points: int("points").notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    issuedBy: bigint("issuedBy", { mode: "number", unsigned: true }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({ memberIdx: index("txn_member_idx").on(table.memberId) })
);

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Push notifications
export const notifications = mysqlTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    message: text("message").notNull(),
    target: mysqlEnum("target", ["all", "member"]).notNull().default("all"),
    targetMemberId: bigint("targetMemberId", {
      mode: "number",
      unsigned: true,
    }),
    sentBy: bigint("sentBy", { mode: "number", unsigned: true }).notNull(),
    status: mysqlEnum("status", ["pending", "sent", "failed"])
      .notNull()
      .default("sent"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({ memberIdx: index("notif_member_idx").on(table.targetMemberId) })
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;




