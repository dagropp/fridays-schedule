import { ChildrenResponse, Gender, isRelevantDate } from "../api";
import { ClsxClass } from "./types";

const documentTitle = document.title;

export function clsx(...classes: ClsxClass[]) {
  return classes.filter(Boolean).join(" ");
}

export function getContentTitle(scheduled: ChildrenResponse[]) {
  switch (scheduled.length) {
    case 1:
      return scheduled[0].gender === Gender.male
        ? "בינתיים נרשם קטנטן אחד ✨"
        : "בינתיים נרשמה קטנטנה אחת ✨";
    case 0:
      return "אף אחד עוד לא נרשם 😢";
    default:
      return `בינתיים נרשמו ${scheduled.length} קטנטנים וקטנטנות ✨`;
  }
}

export function getTeacherResponse(schedule?: string) {
  return isRelevantDate(schedule)
    ? "איזה כיף! נתראה בשישי 🥖🥖🥖"
    : "כרגע לא אפתח את הגן בשישי... 😓";
}

export function setNotificationTitle(name?: string) {
  if (document.visibilityState === "hidden") {
    let times = 0;
    const interval = setInterval(() => {
      times++;
      document.title = times % 2 ? documentTitle : `🗨️ הודעה מ${name}`;
    }, 1000);

    document.onvisibilitychange = () => {
      clearInterval(interval);
      document.title = documentTitle;
    };
  }
}
