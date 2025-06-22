import { Container } from "@mui/material";
import { LoginForm } from "./components/LoginForm";
import { AuthenticatedApp } from "./components/AuthenticatedApp";
import { useAuth } from "./contexts/AuthContext"; // Ensure useAuth is imported
import { CircularProgress } from "@mui/material"; // Import for loading indicator

export default function App() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container>
        <LoginForm />
      </Container>
    );
  }
  return <AuthenticatedApp />;
}