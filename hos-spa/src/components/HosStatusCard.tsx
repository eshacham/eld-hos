import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Chip,
  Box,
  IconButton,
  Tooltip,
  keyframes
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { apiClient } from "../lib/api";
import RefreshIcon from '@mui/icons-material/Refresh';

// Define a keyframe animation for the spinning effect
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

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
  v == null ? "N/A" : `${Number(v).toFixed(2)}${unit}`;

// Wrap in React.memo for performance optimization.
// This prevents re-renders if the parent re-renders but props haven't changed.
export const HosStatusCard = React.memo(function HosStatusCard({
  driverId,
  vendorId
}: {
  driverId: string;
  vendorId: string;
}) {
  const { data, isLoading, error, refetch, isFetching } = useQuery<Snapshot, AxiosError>({
    queryKey: ["hos", driverId, vendorId],
    queryFn: () => {
      console.log(`[HosStatusCard] Fetching HOS data for driverId: ${driverId}`); 
      return apiClient
        .get(`/drivers/${driverId}/hos`)
        .then((r) => r.data)
    },
    enabled: !!driverId
  });

  if (isLoading) return <CircularProgress />;
  // Check for a 404 specifically, which is a valid "not found" state, not a general error.
  // The `instanceof AxiosError` check makes this safer.
  if (error instanceof AxiosError && error.response?.status === 404)
    return <Typography color="text.secondary">Data not found</Typography>;
  if (error) return <Typography color="error">Unable to load HOS data</Typography>;
  if (!data) return null;

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div">
              HOS Status
            </Typography>
            <Tooltip title="Refresh Data">
              {/* The span is needed for the tooltip to work when the button is disabled */}
              <span>
                <IconButton onClick={() => refetch()} disabled={isFetching}>
                  {/* Apply the spin animation when isFetching is true */}
                  <RefreshIcon sx={{ animation: isFetching ? `${spin} 1s linear infinite` : 'none' }} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

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
});
