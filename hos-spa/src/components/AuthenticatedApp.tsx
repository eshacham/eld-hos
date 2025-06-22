import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button
} from "@mui/material";
import { DriverSearch } from "./DriverSearch";
import { HosStatusCard } from "./HosStatusCard";
import { UpdateHosForm } from "./UpdateHosForm";
import { useAuth } from "../contexts/AuthContext";

export function AuthenticatedApp() {
  const { vendorId, logout } = useAuth();
  const [driverId, setDriverId] = useState("");

  return (
    <Container sx={{ mt: 4, maxWidth: 800 }}>
      {/* Vendor banner */}
      <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Typography variant="h6" sx={{ mr: 2 }}>
              Active Vendor:
            </Typography>
            <Chip
              label={vendorId}
              size="medium"
              color="primary"
            />
          </Box>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
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