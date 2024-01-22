export type RequestType = "GET" | "POST" | "DELETE" | "PUT";

export enum Gender {
  male,
  female,
}

export type ChildrenResponse = {
  id: number;
  name: string;
  gender: Gender;
  schedule?: string;
};
