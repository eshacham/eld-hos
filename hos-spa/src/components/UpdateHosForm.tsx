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
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiWithVendor } from "../lib/api";
import { AxiosError } from "axios";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import React from "react";


// 1. Define components outside the rendering component.
// This prevents React from unmounting and remounting the Alert on every render of UpdateHosForm.
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


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

// 2. Move pure helper functions outside the component.
// This function has no dependencies on props or state, so it can be a standalone utility.
const num = (fd: FormData, k: string) =>
  fd.get(k) ? Number(fd.get(k)) : undefined;

// 3. Wrap the component in React.memo.
// This prevents re-renders if the parent re-renders but the props (vendorId, driverId) have not changed.
export const UpdateHosForm = React.memo(function UpdateHosForm({
  vendorId,
  driverId
}: {
  vendorId: string;
  driverId: string;
}) {
  const qc = useQueryClient();
  const [dutyStatus, setDutyStatus] = useState(dutyOptions[0]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

const mutation = useMutation<unknown, AxiosError, EldPayload>({
  mutationFn: (payload) => apiWithVendor(vendorId).post("/eld/events", payload),
  onSuccess: (_resp, vars) => {
    // Invalidate the 'hos' query for the specific driver/vendor.
    // This marks it as stale and forces a refetch the next time it's observed
    // (e.g., when HosStatusCard is rendered or if it's already active).
    qc.invalidateQueries({ queryKey: ["hos", driverId, vendorId] });

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

  // 4. Memoize event handlers with useCallback.
  // This ensures the function reference is stable across re-renders, which is a best practice.
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
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
  }, [vendorId, driverId, dutyStatus, mutation]); // Dependencies ensure the function updates when these values change.

  const handleDutyStatusChange = useCallback((_event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue) {
      setDutyStatus(newValue);
    }
  }, []); // setDutyStatus is stable, so no dependencies are needed.

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={handleSubmit}
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
          onChange={handleDutyStatusChange}
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
});
