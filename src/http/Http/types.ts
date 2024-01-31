export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ParsedPayload = {
  url: string;
  body?: string;
};

export type HttpResponse<T> = {
  data: T;
  status: number;
  abort: (reason?: string) => void;
};

export type RequestOptions<U extends object> = {
  payload?: U;
  headers?: HeadersInit;
};

export type PollingRequestOptions<T, U extends object> = RequestOptions<U> & {
  seconds?: number;
  onSuccess?: (value: HttpResponse<T>) => void;
  onError?: (error: unknown) => void;
  onFinally?: () => void;
};

export type PollingReturn = {
  clear: () => void;
};
