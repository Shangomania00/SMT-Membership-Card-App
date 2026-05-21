export const Errors = {
  forbidden: (message: string) => new Error(message),
  unauthorized: (message: string) => new Error(message),
  badRequest: (message: string) => new Error(message),
  notFound: (message: string) => new Error(message),
};

export default {
  Errors
};
