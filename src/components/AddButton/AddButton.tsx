import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { AddButtonProps } from "./types";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Gender, isRelevantDate, toggleSchedule } from "../../api";
import { useAppContext } from "../../context";
import "./styles.css";

export function AddButton({
  data,
  onUpdate,
  onDeny,
}: AddButtonProps): ReactElement | null {
  const { teacher } = useAppContext();
  const [denied, setDenied] = useState(false);

  const toggle = useCallback(async () => {
    onUpdate(data.id);
    try {
      await toggleSchedule(data);
    } catch {
      onUpdate(data.id, `מצטער, לא הצלחתי לרשום את ${data.name}`);
    }
  }, [data, onUpdate]);

  const hideDialog = useCallback(() => {
    onDeny();
    setDenied(true);
  }, [onDeny]);

  const isScheduled = useMemo(
    () => isRelevantDate(data.schedule),
    [data.schedule]
  );

  useEffect(() => {
    return () => setDenied(false);
  }, []);

  const message = useMemo(() => {
    if (data.id === teacher?.id) {
      return isScheduled
        ? "איזה כיף! נתראה בשישי 🥖🥖🥖"
        : "יהיה גן ביום שישי?";
    } else if (data.gender === Gender.male) {
      return `${data.name} יבוא ביום שישי?`;
    }
    return `${data.name} תבוא ביום שישי?`;
  }, [data.gender, data.name, data.id, teacher?.id, isScheduled]);

  return denied ? null : (
    <Card raised className="add-card">
      <CardContent>
        <Typography>{message}</Typography>
      </CardContent>
      <CardActions className="add-card-actions">
        {isScheduled && (
          <Button onClick={toggle} variant="outlined">
            בסוף לא אוכל לפתוח את הגן
          </Button>
        )}
        {!isScheduled && (
          <Button onClick={hideDialog} variant="outlined">
            לא
          </Button>
        )}
        {!isScheduled && (
          <Button variant="contained" onClick={toggle}>
            כן
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
