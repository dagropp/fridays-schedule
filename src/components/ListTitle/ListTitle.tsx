import { Typography } from "@mui/material";
import { ListTitleProps } from "./types";
import { getContentTitle } from "../../general";

export function ListTitle({ scheduled }: ListTitleProps) {
  return <Typography variant="body2">{getContentTitle(scheduled)}</Typography>;
}
