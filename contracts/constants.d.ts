export const Session: {
  cookieName: string;
  maxAgeMs: number;
};

declare const constants: {
  Session: typeof Session;
};

export default constants;
