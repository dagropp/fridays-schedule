import { ChildrenResponse } from "../../api";

export type AddButtonProps = {
  data: ChildrenResponse;
  onUpdate: (id: number, errorMessage?: string) => void;
};
