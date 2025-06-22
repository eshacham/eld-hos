import {
  Button,
  TextField,
  Stack,
  ToggleButton,
  Snackbar,
  ToggleButtonGroup,
  Tooltip,
  Box
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiWithVendor } from "../lib/api";
import { AxiosError } from "axios";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import React from "react";


const dutyOptions = [
  "OFF-DUTY",
  "SLEEPER BERTH",
  "DRIVING",
  "ON-DUTY NOT DRIVING"
];

interface EldEvent {
  driverId: string;
  availableHours?: number;
  availableDrivingTime?: number;
  availableOnDutyTime?: number;
  available6070?: number;
  dutyStatus: string;
  recordedAt: string;
}

interface EldPayload {
  vendorId: string;
  events: EldEvent[];
}

export function UpdateHosForm({
  vendorId,
  driverId
}: {
  vendorId: string;
  driverId: string;
}) {
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const qc = useQueryClient();
  const [dutyStatus, setDutyStatus] = useState(dutyOptions[0]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

const mutation = useMutation<unknown, AxiosError, EldPayload>({
  mutationFn: (payload) => apiWithVendor(vendorId).post("/eld/events", payload),
  onSuccess: (_resp, vars) => {
    const newSnap = vars.events[0];
    qc.setQueryData<EldEvent | undefined>(
      ["hos", driverId, vendorId], 
      (old) => ({
      ...old,
      ...newSnap
    }));
    setSnackbarMessage("Event posted successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  },
  onError: (error) => {
    setSnackbarMessage(`Error posting event: ${error.message}`);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }
});

  const num = (fd: FormData, k: string) =>
    fd.get(k) ? Number(fd.get(k)) : undefined;

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const fd = new FormData(e.currentTarget);
        mutation.mutate({
          // Basic validation: ensure required fields are not empty
          // More complex validation can be added with a form library
          // if (!fd.get("availableHours") || !fd.get("drvTime") || !fd.get("dutyTime") || !fd.get("cycle")) {
          //   setSnackbarMessage("Please fill all numeric fields."); setSnackbarSeverity("error"); setSnackbarOpen(true); return; }
          vendorId,
          events: [
            {
              driverId,
              availableHours:       num(fd, "availableHours"),
              availableDrivingTime: num(fd, "drvTime"),
              availableOnDutyTime:  num(fd, "dutyTime"),
              available6070:        num(fd, "cycle"),
              dutyStatus,
              recordedAt: new Date().toISOString()
            }
          ]
        }, {
         onSuccess: () => {
          form.reset(); // ⬅️ clears numeric inputs
          setDutyStatus(dutyOptions[0]); // reset toggle
        }
        });
      }}
    >
      {/* read-only context fields */}
      <Stack direction="row" spacing={2}>
        <TextField
          label="Vendor"
          value={vendorId}
          fullWidth
          variant="filled"
          InputProps={{ readOnly: true }}
          sx={{ bgcolor: "action.disabledBackground" }}
        />
        <TextField
          label="Driver ID"
          value={driverId}
          fullWidth
          variant="filled"
          InputProps={{ readOnly: true }}
          sx={{ bgcolor: "action.disabledBackground" }}
        />
      </Stack>

      {/* numeric fields in two columns */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2
        }}
      >
        <TextField name="availableHours" label="Avail. Hours" type="number" />
        <TextField name="drvTime" label="Driving Time" type="number" required />
        <TextField name="dutyTime" label="On-Duty Time" type="number" required />
        <TextField name="cycle" label="60/70 Cycle" type="number" required />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>


      {/* duty-status selector */}
      <Tooltip title="Select duty status">
        <ToggleButtonGroup
          value={dutyStatus}
          exclusive
          onChange={(_, v) => v && setDutyStatus(v)}
          fullWidth
          color="primary"
        >
          {dutyOptions.map((opt) => (
            <ToggleButton key={opt} value={opt}>
              {opt}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Tooltip>

      <Button
        type="submit"
        variant="contained"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Sending…" : "Send Event"}
      </Button>
    </Stack>
  );
}
