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
  const { childId, setChildId, teacher } = useAppContext();
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
            <MenuItem value={teacher?.id} divider>
              {teacher?.name}
            </MenuItem>
            <ListSubheader>הורים</ListSubheader>
            {data
              .filter((child) => child.id !== teacher?.id)
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
