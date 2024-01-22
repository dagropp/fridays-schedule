import { Card, CardContent, Typography } from "@mui/material";
import { ReactElement } from "react";
import { MayaCardProps } from "./types";
import { useAppContext } from "../../context";
import { getMayaResponse } from "../../general";

export function MayaCard({ data }: MayaCardProps): ReactElement | null {
  const { childId } = useAppContext();

  return childId === -1 ? null : (
    <Card raised>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          הודעה ממאיה
        </Typography>
        <Typography>{getMayaResponse(data?.schedule)}</Typography>
      </CardContent>
    </Card>
  );
}
