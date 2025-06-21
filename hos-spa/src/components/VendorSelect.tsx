// src/components/VendorSelect.tsx
import { MenuItem, TextField } from "@mui/material";
import { vendorKeys } from "../vendorKeys";

export function VendorSelect({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <TextField
      select
      label="Vendor"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ minWidth: 160 }}
    >
      {Object.keys(vendorKeys).map((id) => (
        <MenuItem key={id} value={id}>
          {id}
        </MenuItem>
      ))}
    </TextField>
  );
}
