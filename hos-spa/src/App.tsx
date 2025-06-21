import { useState } from "react";
import { Container, Box } from "@mui/material";
import { HosStatusCard } from "./components/HosStatusCard";
import { UpdateHosForm } from "./components/UpdateHosForm";
import { DriverSearch } from "./components/DriverSearch";

export default function App() {
  const [driverId, setDriverId] = useState("");

  return (
    <Container sx={{ mt: 4 }}>
      <DriverSearch onSelect={setDriverId} />
      <Box sx={{ my: 4 }} />
      {driverId && <HosStatusCard driverId={driverId} />}
      <Box sx={{ my: 4 }} />
      <UpdateHosForm />
    </Container>
  );
}
