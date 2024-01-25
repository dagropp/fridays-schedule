import { Card, CardContent, Typography } from "@mui/material";
import { ReactElement } from "react";
import { useAppContext } from "../../context";
import { getTeacherResponse } from "../../general";

export function TeacherCard(): ReactElement | null {
  const { childId, teacher } = useAppContext();

  return childId === teacher?.id ? null : (
    <Card raised>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          הודעה מ{teacher?.name}
        </Typography>
        <Typography>{getTeacherResponse(teacher?.schedule)}</Typography>
      </CardContent>
    </Card>
  );
}
