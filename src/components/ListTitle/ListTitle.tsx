import { Typography } from "@mui/material";
import { ListTitleProps } from "./types";
import { useMemo } from "react";
import { Gender } from "../../api";

export function ListTitle({ scheduled }: ListTitleProps) {
  const title = useMemo(() => {
    switch (scheduled.length) {
      case 1:
        return scheduled[0].gender === Gender.male
          ? "בינתיים נרשם ליום שישי קטנטן אחד ✨"
          : "בינתיים נרשמה ליום שישי קטנטנה אחת ✨";
      case 0:
        return "אף אחד עוד לא נרשם 😢";
      default:
        return (
          <>
            בינתיים נרשמו ליום שישי <strong>{scheduled.length}</strong> קטנטנים
            וקטנטנות ✨
          </>
        );
    }
  }, [scheduled]);

  return <Typography variant="body2">{title}</Typography>;
}
