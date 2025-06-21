import { Container, Box } from "@mui/material";
import { HosStatusCard } from "./components/HosStatusCard";
import { UpdateHosForm } from "./components/UpdateHosForm";

export default function App() {
  const driverId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
  return (
    <Container sx={{ mt: 4 }}>
      <UpdateHosForm />
      <Box sx={{ my: 4 }} />
      <HosStatusCard driverId={driverId} />
    </Container>
  );
}
