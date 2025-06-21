// src/components/UpdateHosForm.tsx
import { Button, TextField, Stack } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

// Define strongly-typed interfaces for the API payload
interface EldEvent {
  driverId: string;
  availableHours: number;
  dutyStatus: string;
  recordedAt: string;
}

interface EldPayload {
  vendorId: string;
  driverId: string;
  events: EldEvent[];
}

export function UpdateHosForm() {
  const qc = useQueryClient();

  // Use generics to provide strong types for the mutation's data and variables
  const mutation = useMutation<unknown, Error, EldPayload>({
    mutationFn: (payload) => api.post("/eld/events", payload),
    onSuccess: (_, vars) => {
      // `vars` is now correctly typed as EldPayload
      qc.invalidateQueries({ queryKey: ["hos", vars.driverId] });
    }
  });

  return (
    <Stack
      spacing={2}
      component="form"
      onSubmit={e => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const driverId = fd.get("driverId") as string;
        mutation.mutate({
          vendorId: "DemoSim",
          driverId,
          events: [{
            driverId,
            availableHours: Number(fd.get("hours")),
            dutyStatus: fd.get("status") as string, // Explicitly cast form value
            recordedAt: new Date().toISOString()
          }]
        });
      }}
    >
      <TextField name="driverId" label="Driver ID (GUID)" required />
      <TextField name="hours"    label="Avail. Hours" type="number" />
      <TextField name="status"   label="Duty Status" defaultValue="ON_DUTY" />
      <Button type="submit" variant="contained" disabled={mutation.isPending}>
        {mutation.isPending ? "Sending…" : "Send"}
      </Button>
    </Stack>
  );
}
