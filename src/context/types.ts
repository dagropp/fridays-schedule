import { ChildrenResponse } from "../api";

export type ChildId = number | null;

export type AppContextType = {
  childId?: ChildId;
  setChildId: (value: ChildId) => void;
  teacher?: ChildrenResponse;
};
