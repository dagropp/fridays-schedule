import { ChildrenResponse } from "../../api";

export type ListItemProps = {
  data: ChildrenResponse;
  onUpdate: (id: number, errorMessage?: string) => void;
};
