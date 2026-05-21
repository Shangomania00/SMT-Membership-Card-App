export const Session = {
  cookieName: "session",
  maxAgeMs: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const ErrorMessages = {
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  NOT_FOUND: "Resource not found",
  BAD_REQUEST: "Invalid request",
  INTERNAL_ERROR: "Internal server error",
};

export const Paths = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ADMIN: "/admin",
  CARD: "/card",
  API: {
    AUTH: "/api/auth",
    MEMBERS: "/api/members",
    CARDS: "/api/cards",
  },
};

export default {
  Session,
  ErrorMessages,
  Paths
};
