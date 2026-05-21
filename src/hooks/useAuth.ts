export function useAuth() {
  return {
    user: null,
    isLoading: false,
    error: null,
    refetch: async () => null,
    logout: async () => {},
  };
}
