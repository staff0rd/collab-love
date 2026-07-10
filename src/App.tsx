import AuthenticatedApp from "./AuthenticatedApp.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";

const App = () => (
  <AuthProvider>
    <AuthenticatedApp />
  </AuthProvider>
);

export default App;
