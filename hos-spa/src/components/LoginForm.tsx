import {
  Paper,
  TextField,
  Button,
  Stack,
  Typography,
  MenuItem,
  Alert
} from "@mui/material";
import { useState } from "react";
const availableVendors = ["DemoSim", "KEEPTRUCKIN", "SAM_SAT"] as const;
import { useAuth } from "../contexts/AuthContext"; 

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [vendorId, setVendorId] = useState<string>(availableVendors[0]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(vendorId, username, password);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"; // Error handling for login failure
      setError(errorMessage); // Set error message
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom align="center">
        HOS Demo Login
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            select
            label="Vendor"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            fullWidth
          >
            {availableVendors.map((vendor) => (
              <MenuItem key={vendor} value={vendor}>
                {vendor}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            disabled={isLoggingIn}
            fullWidth
          >
             {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </Stack>
      </form>      
    </Paper>
  );
}