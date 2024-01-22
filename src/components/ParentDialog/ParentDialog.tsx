import {
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { ParentDialogProps } from "./types";
import { useAppContext } from "../../context";
import "./styles.css";

export function ParentDialog({ data }: ParentDialogProps): ReactElement {
  const { childId, setChildId } = useAppContext();
  const [open, setOpen] = useState(!childId);

  const handleChange = useCallback(
    (event: SelectChangeEvent) => setChildId(Number(event.target.value)),
    [setChildId]
  );

  useEffect(() => {
    setOpen(!childId);
  }, [childId]);

  return (
    <Dialog open={open} PaperProps={{ className: "parent-dialog" }}>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1, direction: "rtl" }}>
          <InputLabel id="parent-dialog-label">מי אתם?</InputLabel>
          <Select onChange={handleChange} labelId="parent-dialog-label">
            <ListSubheader>צוות</ListSubheader>
            <MenuItem value={-1} divider>
              מאיה הגננת
            </MenuItem>
            <ListSubheader>הורים</ListSubheader>
            {data
              .filter((child) => child.id !== -1)
              .map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
