import { ReactElement, useCallback, useMemo, useState } from "react";
import { AddButtonProps } from "./types";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Gender, isRelevantDate, toggleSchedule } from "../../api";
import "./styles.css";

export function AddButton({ data, onUpdate }: AddButtonProps): ReactElement {
  const [denied, setDenied] = useState(false);

  const toggle = useCallback(async () => {
    onUpdate(data.id);
    try {
      await toggleSchedule(data);
    } catch {
      onUpdate(data.id, `מצטער, לא הצלחתי לרשום את ${data.name}`);
    }
  }, [data, onUpdate]);

  const hideDialog = useCallback(() => setDenied(true), []);

  const isMaya = useMemo(() => data.id === -1, [data.id]);

  const isScheduled = useMemo(
    () => isRelevantDate(data.schedule),
    [data.schedule]
  );

  const message = useMemo(() => {
    if (isMaya) {
      if (isScheduled) return "איזה כיף! נתראה בשישי 🥖🥖🥖";
      return denied ? "בטוחה?" : "תפתחי את הגן ביום שישי?";
    } else if (denied) {
      return "בטוחים?";
    } else if (data.gender === Gender.male) {
      return `${data.name} יבוא ביום שישי?`;
    }
    return `${data.name} תבוא ביום שישי?`;
  }, [data.gender, data.name, denied, isMaya, isScheduled]);

  return (
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
        {!denied && !isScheduled && (
          <Button onClick={hideDialog} variant="outlined">
            לא
          </Button>
        )}
        {!isScheduled && (
          <Button variant="contained" onClick={toggle}>
            {denied ? "טוב בסדר" : "כן"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
