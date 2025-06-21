// src/components/HosStatusCard.tsx
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

type Snapshot = {
  dutyStatus: string | null;
  availableHours: number | null;
  availableDrivingTime: number | null;
};

export function HosStatusCard({ driverId }: { driverId: string }) {
  const { data, isLoading, error } = useQuery<Snapshot>({
    queryKey: ["hos", driverId],
    queryFn: () => api.get(`/drivers/${driverId}/hos`).then(r => r.data)
  });

  if (isLoading) return <CircularProgress />;
  if (error)     return <Typography color="error">Failed to load HOS</Typography>;
  if (!data)     return <Typography>No data yet.</Typography>;

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h6">Duty: {data.dutyStatus ?? "—"}</Typography>
        <Typography>Avail. Hours: {data.availableHours ?? "—"}</Typography>
        <Typography>Driving Time: {data.availableDrivingTime ?? "—"} h</Typography>
      </CardContent>
    </Card>
  );
}
