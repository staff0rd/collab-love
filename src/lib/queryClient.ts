import { QueryClient } from "@tanstack/react-query";

const KEEP_CACHE_FOR_WHOLE_SESSION_MS = Infinity;
const REVALIDATE_ON_EVERY_MOUNT_MS = 0;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: KEEP_CACHE_FOR_WHOLE_SESSION_MS,
      staleTime: REVALIDATE_ON_EVERY_MOUNT_MS,
    },
  },
});
