// Type declarations for contracts/constants.js
export const Session: {
  cookieName: string;
  maxAgeMs: number;
};

export const ErrorMessages: {
  UNAUTHORIZED: string;
  FORBIDDEN: string;
  NOT_FOUND: string;
  BAD_REQUEST: string;
  INTERNAL_ERROR: string;
};

export const Paths: {
  HOME: string;
  LOGIN: string;
  SIGNUP: string;
  ADMIN: string;
  CARD: string;
  API: {
    AUTH: string;
    MEMBERS: string;
    CARDS: string;
  };
};
