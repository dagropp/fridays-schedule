import { Card, CardContent, Typography } from "@mui/material";
import { isRelevantDate } from "../../api";
import { ReactElement } from "react";
import { MayaCardProps } from "./types";
import { useAppContext } from "../../context";

export function MayaCard({ data }: MayaCardProps): ReactElement | null {
  const { childId } = useAppContext();

  return childId === -1 ? null : (
    <Card raised>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          הודעה ממאיה
        </Typography>
        <Typography>
          {isRelevantDate(data?.schedule)
            ? "איזה כיף! נתראה בשישי 🥖🥖🥖"
            : "כרגע לא אפתח את הגן... 😓"}
        </Typography>
      </CardContent>
    </Card>
  );
}
