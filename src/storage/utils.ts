import { ChildId } from "../context";
import { CHILD_ID_KEY } from "./constants";

function get(): ChildId {
  const id = localStorage.getItem(CHILD_ID_KEY);
  return id ? Number(id) : null;
}

function set(id: number) {
  localStorage.setItem(CHILD_ID_KEY, String(id));
}

function reset() {
  localStorage.removeItem(CHILD_ID_KEY);
}

export const storage = { get, set, reset };
