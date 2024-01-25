import { api, getNextFriday, isRelevantDate } from ".";
import { CHILDREN_API, METADATA_API, SCHEDULE_API } from "./constants";
import { ChildrenResponse, Metadata, MetadataCompact } from "./types";

export async function getChildren(): Promise<ChildrenResponse[]> {
  return await api.get(CHILDREN_API);
}

export async function getMetadata(
  isPolling?: boolean
): Promise<MetadataCompact | Metadata> {
  const query = isPolling ? "polling=true" : "";
  return await api.get(METADATA_API, query);
}

export async function toggleSchedule({ id, schedule }: ChildrenResponse) {
  const payload = { id, schedule: getNextFriday().toString() };
  return schedule && isRelevantDate(schedule)
    ? await api.delete(SCHEDULE_API, id)
    : await api.post(SCHEDULE_API, payload);
}
