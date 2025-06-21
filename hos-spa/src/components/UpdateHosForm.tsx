// src/components/UpdateHosForm.tsx
import { Button, TextField, Stack } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function UpdateHosForm() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post("/eld/events", payload),
    onSuccess: (_, vars: any) => {
      // invalidate cache so HosStatusCard refreshes
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
            dutyStatus: fd.get("status"),
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
