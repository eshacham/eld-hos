import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  // Divider,
  Box,
  Chip
} from "@mui/material";
import { VendorSelect } from "./components/VendorSelect";
import { DriverSearch } from "./components/DriverSearch";
import { HosStatusCard } from "./components/HosStatusCard";
import { UpdateHosForm } from "./components/UpdateHosForm";
import { vendorKeys } from "./vendorKeys";

export default function App() {
  const [vendorId, setVendorId] = useState("DemoSim");
  const [driverId, setDriverId] = useState("");

  return (
    <Container sx={{ mt: 4, maxWidth: 800 }}>
      {/* Vendor picker banner */}
      <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Select Active Vendor
        </Typography>
        <Box display="flex" alignItems="center">
          <VendorSelect value={vendorId} onChange={setVendorId} />
          <Chip
            label={`API key: ${vendorKeys[vendorId]}`}
            size="small"
            sx={{ ml: 2 }}
            color="info"
          />
        </Box>
      </Paper>

      {/* Driver dashboard section */}
      <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Driver Dashboard
        </Typography>

        <DriverSearch onSelect={setDriverId} />

        {driverId && (
          <Box sx={{ mt: 3 }}>
            <HosStatusCard vendorId={vendorId} driverId={driverId} />
          </Box>
        )}
      </Paper>

      {/* ELD event poster */}
      {driverId && (
        <Paper sx={{ p: 2 }} variant="outlined">
          <Typography variant="h6" gutterBottom>
            Simulate ELD Event
          </Typography>
          <UpdateHosForm vendorId={vendorId} driverId={driverId} />
        </Paper>
      )}
    </Container>
  );
}
