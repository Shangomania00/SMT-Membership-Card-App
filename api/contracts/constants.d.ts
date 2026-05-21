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

declare const constants: {
  Session: typeof Session;
  ErrorMessages: typeof ErrorMessages;
  Paths: typeof Paths;
};

export default constants;
