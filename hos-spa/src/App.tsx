import { useState } from "react";
import { Container, Box } from "@mui/material";
import { VendorSelect } from "./components/VendorSelect";
import { DriverSearch } from "./components/DriverSearch";
import { HosStatusCard } from "./components/HosStatusCard";
import { UpdateHosForm } from "./components/UpdateHosForm";

export default function App() {
  const [vendorId, setVendorId]   = useState("DemoSim");
  const [driverId, setDriverId]   = useState("");

  return (
    <Container sx={{ mt: 4 }}>
      <VendorSelect value={vendorId} onChange={setVendorId} />
      <Box sx={{ my: 2 }} />
      <DriverSearch onSelect={setDriverId} />

      {driverId && (
        <>
          <Box sx={{ my: 2 }} />
          <HosStatusCard vendorId={vendorId} driverId={driverId} />
          <Box sx={{ my: 2 }} />
          <UpdateHosForm vendorId={vendorId} driverId={driverId} />
        </>
      )}
    </Container>
  );
}
