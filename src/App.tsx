import { QueryClientProvider } from "@tanstack/react-query";

import AuthenticatedApp from "./AuthenticatedApp.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import { queryClient } from "./lib/queryClient.ts";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
