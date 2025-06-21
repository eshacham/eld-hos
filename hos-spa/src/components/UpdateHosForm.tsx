// src/components/UpdateHosForm.tsx  (simulates ELD, req #12)
import { Button, TextField, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export function UpdateHosForm() {
  const mutation = useMutation({
    mutationFn: (payload) => api.post("/eld/events", payload)
  });

  return (
    <Stack spacing={2} component="form" onSubmit={(e) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const payload = { 
        vendor: "DemoSim",
        events: [{
          driverId: form.get("driverId"),
          availableHours: Number(form.get("hours")),
          dutyStatus: form.get("status")
        }]
      };
      mutation.mutate(payload);
    }}>
      <TextField name="driverId" label="Driver ID (GUID)" required />
      <TextField name="hours"    label="Available Hours" type="number" />
      <TextField name="status"   label="Duty Status" defaultValue="ON_DUTY" />
      <Button type="submit" variant="contained">Send</Button>
    </Stack>
  );
}
