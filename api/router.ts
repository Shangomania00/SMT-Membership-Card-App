import { createRouter } from "./middleware";
import { memberRouter } from "./routers/member";
import { pointsRouter } from "./routers/points";
import { notificationRouter } from "./routers/notification";
import { adminRouter } from "./routers/admin";

export const appRouter = createRouter({  member: memberRouter,
  points: pointsRouter,
  notification: notificationRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;




