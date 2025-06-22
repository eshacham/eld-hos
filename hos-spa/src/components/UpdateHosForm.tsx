import {
  Button,
  TextField,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Box
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiWithVendor } from "../lib/api";
import { AxiosError } from "axios";


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
  const qc = useQueryClient();
  const [dutyStatus, setDutyStatus] = useState(dutyOptions[0]);

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
          form.reset();           // ⬅️ clears numeric inputs
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
        <TextField name="drvTime" label="Driving Time" type="number" />
        <TextField name="dutyTime" label="On-Duty Time" type="number" />
        <TextField name="cycle" label="60/70 Cycle" type="number" />
      </Box>

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
