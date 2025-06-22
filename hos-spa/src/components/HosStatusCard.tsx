import {
  Card, CardContent, Typography, CircularProgress, Stack, Chip
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { apiWithVendor } from "../lib/api";
import { AxiosError } from "axios";

type Snapshot = {
  dutyStatus: string | null;
  availableHours: number | null;
  availableDrivingTime: number | null;
  availableOnDutyTime: number | null;
  available6070: number | null;
  recordedAt: string;
};

const fmt = (v: number | null | undefined) => (v ?? "—");

// Map duty status → chip color
const dutyColors: Record<string, "default" | "success" | "warning" | "info"> = {
  "OFF-DUTY": "default",
  "SLEEPER BERTH": "info",
  "DRIVING": "warning",
  "ON-DUTY NOT DRIVING": "success"
};

export function HosStatusCard({
  driverId,
  vendorId
}: {
  driverId: string;
  vendorId: string;
}) {
  const { data, isLoading, error } = useQuery<Snapshot, AxiosError>({
  queryKey: ["hos", driverId, vendorId],
  queryFn: () =>
    apiWithVendor(vendorId).get(`/drivers/${driverId}/hos`).then(r => r.data),
  enabled: !!driverId,     // still only runs when driver loaded
  staleTime: 300_000       // redundant, but explicit
});

  if (isLoading) return <CircularProgress />;

  if (error) {
    if (error.response?.status === 404) {
      return <Typography color="text.secondary">Data not found</Typography>;
    }
    return <Typography color="error">Unable to load HOS data</Typography>;
  }

  if (!data) return null;

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardContent>
        <Stack spacing={1}>
          <Chip
            label={data.dutyStatus ?? "Unknown"}
            color={dutyColors[data.dutyStatus ?? ""] ?? "default"}
          />
          <Typography>Available Hours: {fmt(data.availableHours)}</Typography>
          <Typography>
            Driving Time: {fmt(data.availableDrivingTime)} h
          </Typography>
          <Typography>
            On-Duty Time: {fmt(data.availableOnDutyTime)} h
          </Typography>
          <Typography>60/70 Cycle: {fmt(data.available6070)} h</Typography>
          <Typography fontSize="0.8rem" color="text.secondary">
            Recorded: {new Date(data.recordedAt).toLocaleString()}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
