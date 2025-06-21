// src/components/DriverSearch.tsx
import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

export function DriverSearch({ onSelect }: { onSelect: (id: string) => void }) {
  const [id, setId] = useState("");

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        label="Driver ID"
        value={id}
        onChange={e => setId(e.target.value)}
        size="small"
      />
      <Button variant="outlined" onClick={() => onSelect(id)}>Load</Button>
    </Stack>
  );
}
