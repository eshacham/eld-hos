import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Chip,
  Box
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { apiWithVendor } from "../lib/api";

type Snapshot = {
  dutyStatus: string | null;
  availableHours: number | null;
  availableDrivingTime: number | null;
  availableOnDutyTime: number | null;
  available6070: number | null;
  recordedAt: string;
};

const dutyColors: Record<string, "default" | "success" | "warning" | "info"> = {
  "OFF-DUTY": "default",
  "SLEEPER BERTH": "info",
  "DRIVING": "warning",
  "ON-DUTY NOT DRIVING": "success"
};

const show = (v: number | null | undefined, unit = "") =>
  v == null ? "N/A" : `${v}${unit}`;

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
      apiWithVendor(vendorId)
        .get(`/drivers/${driverId}/hos`)
        .then((r) => r.data),
    enabled: !!driverId
  });

  if (isLoading) return <CircularProgress />;
  if (error?.response?.status === 404)
    return <Typography color="text.secondary">Data not found</Typography>;
  if (error) return <Typography color="error">Unable to load HOS data</Typography>;
  if (!data) return null;

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* duty status chip */}
          <Chip
            label={data.dutyStatus ?? "Unknown"}
            color={dutyColors[data.dutyStatus ?? ""] ?? "default"}
            sx={{ alignSelf: "flex-start" }}
          />

          {/* numeric fields in same order & grid layout as the form */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 1
            }}
          >
            <Typography>Available Hours: {show(data.availableHours)}</Typography>
            <Typography>
              Driving Time: {show(data.availableDrivingTime, " h")}
            </Typography>
            <Typography>
              On-Duty Time: {show(data.availableOnDutyTime, " h")}
            </Typography>
            <Typography>
              60/70 Cycle: {show(data.available6070, " h")}
            </Typography>
          </Box>

          <Typography fontSize="0.8rem" color="text.secondary">
            Recorded: {new Date(data.recordedAt).toLocaleString()}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
