import { Button, TextField, Stack } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiWithVendor } from "../lib/api";

export interface EldEvent {
  driverId: string;
  availableHours?: number;
  availableDrivingTime?: number;
  availableOnDutyTime?: number;
  available6070?: number;
  dutyStatus?: string;
  recordedAt: string;
}
export interface EldPayload {
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

  const mutation = useMutation<unknown, Error, EldPayload>({
    mutationFn: (payload) => apiWithVendor(vendorId).post("/eld/events", payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["hos", driverId, vendorId] })
  });

  return (
    <Stack
      spacing={2}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        const vendorId   = (fd.get("vendorId") as string).trim();
        const driverId   = (fd.get("driverId") as string).trim();
        const parseNum   = (key: string) =>
          fd.get(key) ? Number(fd.get(key)) : undefined;

        mutation.mutate({
          vendorId,
          events: [
            {
              driverId,
              availableHours:       parseNum("hours"),
              availableDrivingTime: parseNum("driveTime"),
              availableOnDutyTime:  parseNum("dutyTime"),
              available6070:        parseNum("cycle"),
              dutyStatus: (fd.get("status") as string) || undefined,
              recordedAt: new Date().toISOString()
            }
          ]
        });
      }}
    >
      {/* Vendor & Driver */}
      <TextField name="vendorId" label="Vendor ID" defaultValue="DemoSim" required />
      <TextField name="driverId" label="Driver ID (GUID)" required />

      {/* Numeric HOS fields */}
      <TextField name="hours"     label="Avail. Hours"          type="number" />
      <TextField name="driveTime" label="Avail. Driving Time"   type="number" />
      <TextField name="dutyTime"  label="Avail. On-Duty Time"   type="number" />
      <TextField name="cycle"     label="Avail. 60/70 Cycle"    type="number" />

      {/* Duty status */}
      <TextField name="status"    label="Duty Status"           defaultValue="ON_DUTY" />

      <Button type="submit" variant="contained" disabled={mutation.isPending}>
        {mutation.isPending ? "Sending…" : "Send"}
      </Button>
    </Stack>
  );
}
