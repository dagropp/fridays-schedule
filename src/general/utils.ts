import { ClsxClass } from "./types";

export function clsx(...classes: ClsxClass[]) {
  return classes.filter(Boolean).join(" ");
}
