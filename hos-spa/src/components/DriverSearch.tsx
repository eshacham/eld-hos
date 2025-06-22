import { Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

export function DriverSearch({ onSelect }: { onSelect: (id: string) => void }) {
  const [id, setId] = useState("");

  return (
    <Stack direction="row" spacing={2} sx={{ maxWidth: 500 }}>
      <TextField
        fullWidth
        label="Driver ID (GUID)"
        size="small"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <Button variant="outlined" onClick={() => onSelect(id)}>
        Load
      </Button>
    </Stack>
  );
}
