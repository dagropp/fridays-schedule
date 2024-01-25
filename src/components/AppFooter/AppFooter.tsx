import { Button } from "@mui/material";
import { useAppContext } from "../../context";
import { AppFooterProps } from "./types";
import { ReactElement, useCallback, useMemo } from "react";
import { getContentTitle, getTeacherResponse } from "../../general";
import { isRelevantDate } from "../../api";

export function AppFooter({
  childName,
  scheduled,
}: AppFooterProps): ReactElement {
  const { childId, setChildId, teacher } = useAppContext();

  const resetChild = useCallback(() => {
    setChildId(null);
  }, []);

  const isScheduled = useMemo(
    () => isRelevantDate(teacher?.schedule),
    [teacher?.schedule]
  );

  const message = useMemo(() => {
    const count = getContentTitle(scheduled);
    const response = getTeacherResponse(teacher?.schedule);
    return isScheduled ? `${count} ${response}` : response;
  }, [isScheduled, scheduled, teacher?.schedule]);

  const canSendMessage = childId === teacher?.id || isScheduled;

  return (
    <div className="bottom-container">
      {canSendMessage && (
        <Button
          variant="outlined"
          className="share-button"
          href={`whatsapp://send?text=${message}`}
        >
          שיתוף התוצאות
          <img src="/assets/whatsapp-logo.svg" />
        </Button>
      )}
      {childId && (
        <Button variant="outlined" color="secondary" onClick={resetChild}>
          {teacher?.id === childId
            ? `אני לא ${teacher?.name}`
            : `אנחנו לא ה${childName}`}
        </Button>
      )}
    </div>
  );
}
