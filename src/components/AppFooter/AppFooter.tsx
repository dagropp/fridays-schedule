import { Button } from "@mui/material";
import { useAppContext } from "../../context";
import { AppFooterProps } from "./types";
import { ReactElement, useCallback, useMemo } from "react";
import { getContentTitle, getMayaResponse } from "../../general";
import { isRelevantDate } from "../../api";

export function AppFooter({
  maya,
  childName,
  scheduled,
}: AppFooterProps): ReactElement {
  const { childId, setChildId } = useAppContext();

  const resetChild = useCallback(() => {
    setChildId(null);
  }, []);

  const isScheduled = useMemo(
    () => isRelevantDate(maya?.schedule),
    [maya?.schedule]
  );

  const message = useMemo(() => {
    const count = getContentTitle(scheduled);
    const response = getMayaResponse(maya?.schedule);
    return isScheduled ? `${count} ${response}` : response;
  }, [isScheduled, scheduled, maya?.schedule]);

  const canSendMessage = useMemo(
    () => childId === maya?.id || isScheduled,
    [childId, maya?.id, isScheduled]
  );

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
          {maya?.id === childId
            ? "אני לא מאיה הגננת"
            : `אנחנו לא ה${childName}`}
        </Button>
      )}
    </div>
  );
}
