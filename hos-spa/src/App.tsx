import { Container } from "@mui/material";
import { LoginForm } from "./components/LoginForm";
import { AuthenticatedApp } from "./components/AuthenticatedApp";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Container>
        <LoginForm />
      </Container>
    );
  }

  return <AuthenticatedApp />;
}