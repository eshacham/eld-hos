import { MenuItem, TextField, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { vendorKeys } from "../vendorKeys";

export function VendorSelect({
  value,
  onChange
}: {
  value: string;
  onChange: (vendor: string) => void;
}) {
  return (
    <>
      <TextField
        select
        label="Vendor (sets API key)"
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ minWidth: 220, mr: 1 }}
      >
        {Object.keys(vendorKeys).map((v) => (
          <MenuItem key={v} value={v}>
            {v}
          </MenuItem>
        ))}
      </TextField>

      <Tooltip title="Vendor determines which secret API key is sent on POST">
        <InfoIcon fontSize="small" color="action" />
      </Tooltip>
    </>
  );
}
