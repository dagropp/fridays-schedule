import { Metadata } from ".";

export const API_ROOT = "https://danielgropp.com/fridays-server/api";

export const CHILDREN_API = "children.php";
export const SCHEDULE_API = "schedule.php";
export const METADATA_API = "metadata.php";

export const defaultMetadata: Metadata = {
  teacherId: 0,
  lastUpdate: 0,
  lastChildrenUpdate: 0,
};
