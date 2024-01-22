import {
  IconButton,
  Tooltip,
  ListItem as MuiListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { ReactElement, useCallback } from "react";
import { Gender, toggleSchedule } from "../../api";
import { useAppContext } from "../../context";
import { CloseOutlined } from "@mui/icons-material";
import { ListItemProps } from "./types";
import "./styles.css";

export function ListItem({ data, onUpdate }: ListItemProps): ReactElement {
  const { childId } = useAppContext();

  const toggle = useCallback(async () => {
    onUpdate(data.id);
    try {
      await toggleSchedule(data);
    } catch {
      onUpdate(data.id, `מצטער, לא הצלחתי להסיר את ${data.name}`);
    }
  }, [data, onUpdate]);

  const image = data.gender === Gender.male ? "boy" : "girl";

  const tooltip =
    data.gender === Gender.male ? "הוא לא יבוא בסוף" : "היא לא תבוא בסוף";

  return (
    <MuiListItem disablePadding divider>
      <ListItemButton>
        <img src={`/assets/${image}.svg`} className="child-list-item-image" />
        <ListItemText primary={data.name} className="child-list-item-text" />
        {data.id === childId && (
          <Tooltip title={tooltip}>
            <IconButton edge="end" aria-label="comments" onClick={toggle}>
              <CloseOutlined />
            </IconButton>
          </Tooltip>
        )}
      </ListItemButton>
    </MuiListItem>
  );
}
