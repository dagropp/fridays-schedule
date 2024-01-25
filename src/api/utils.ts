import { API_ROOT } from "./constants";
import { RequestType } from "./types";

function getUrl(path: string) {
  return `${API_ROOT}/${path}`;
}

async function request<T extends object, U extends object>(
  path: string,
  method: RequestType,
  payload?: U
): Promise<T> {
  const body = payload ? JSON.stringify(payload) : undefined;
  const response = await fetch(getUrl(path), {
    method,
    body,
    headers: { "Content-Type": "application/json" },
  });
  return (await response.json()) as T;
}

async function get<T extends object>(path: string, query?: string): Promise<T> {
  return await request(query ? `${path}/?${query}` : path, "GET");
}

async function post<T extends object, U extends object>(
  path: string,
  payload?: U
): Promise<T> {
  return await request(path, "POST", payload);
}

async function deleteRequest(path: string, id: number): Promise<void> {
  await request(`${path}/?id=${id}`, "DELETE");
}

export function getNextFriday(): Date {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay() + 5) % 7 || 7));
  return new Date(date);
}

export function isRelevantDate(date?: Date | string): boolean {
  if (!date) return false;
  if (typeof date === "string") date = new Date(date);
  const next = getNextFriday();
  return (
    next.getFullYear() === date.getFullYear() &&
    next.getMonth() === date.getMonth() &&
    next.getDate() === date.getDate()
  );
}

export const api = { get, post, delete: deleteRequest };
