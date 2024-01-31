import { RequestMethod } from "./types";

export function getErrorPayload(method: RequestMethod): string {
  return `Payload is required for '${method}' request`;
}
