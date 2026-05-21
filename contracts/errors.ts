export const Errors = {
  forbidden: (message: string) => {
    const error = new Error(message);
    (error as any).status = 403;
    return error;
  },
  unauthorized: (message: string) => {
    const error = new Error(message);
    (error as any).status = 401;
    return error;
  },
  badRequest: (message: string) => {
    const error = new Error(message);
    (error as any).status = 400;
    return error;
  },
  notFound: (message: string) => {
    const error = new Error(message);
    (error as any).status = 404;
    return error;
  }
};

export default {
  Errors
};
