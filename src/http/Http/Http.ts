import {
  HttpResponse,
  ParsedPayload,
  PollingRequestOptions,
  PollingReturn,
  RequestMethod,
  RequestOptions,
} from "./types";
import { getErrorPayload } from "./utils";

export class Http {
  private root: string = "";
  private defaultHeaders: HeadersInit = {};

  constructor(root?: string, defaultHeaders?: HeadersInit) {
    if (root) this.root = root;
    if (defaultHeaders) this.defaultHeaders = defaultHeaders;
  }

  private getSearchParams<U extends object>(body: U): string {
    const params = new URLSearchParams(body as Record<string, string>);
    return `?${params}`;
  }

  private parsePayload<U extends object>(
    path: string,
    method: RequestMethod,
    payload?: U
  ): ParsedPayload {
    let url = this.root + path;
    switch (method) {
      case "GET":
      case "DELETE":
        if (payload) url += this.getSearchParams(payload);
        return { url };
      default:
        if (!payload) throw new Error(getErrorPayload(method));
        return { url, body: JSON.stringify(payload) };
    }
  }

  private async request<T, U extends object>(
    path: string,
    method: RequestMethod,
    { payload, headers = {} }: RequestOptions<U> = {}
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const { signal, abort } = controller;
    const { url, body } = this.parsePayload(path, method, payload);
    headers = { ...this.defaultHeaders, ...headers };
    const response = await fetch(url, { method, body, headers, signal });
    const data = await response.json();
    return { data, status: response.status, abort };
  }

  public delete<T, U extends object>(
    path: string,
    options?: RequestOptions<U>
  ): Promise<HttpResponse<T>> {
    return this.request<T, U>(path, "DELETE", options);
  }

  public get<T, U extends object>(
    path: string,
    options?: RequestOptions<U>
  ): Promise<HttpResponse<T>> {
    return this.request<T, U>(path, "GET", options);
  }

  public patch<T, U extends object>(
    path: string,
    options?: RequestOptions<U>
  ): Promise<HttpResponse<T>> {
    return this.request<T, U>(path, "PATCH", options);
  }

  public post<T, U extends object>(
    path: string,
    options?: RequestOptions<U>
  ): Promise<HttpResponse<T>> {
    return this.request<T, U>(path, "POST", options);
  }

  public put<T, U extends object>(
    path: string,
    options?: RequestOptions<U>
  ): Promise<HttpResponse<T>> {
    return this.request<T, U>(path, "PUT", options);
  }

  public poll<T, U extends object>(
    path: string,
    options: PollingRequestOptions<T, U> = {}
  ): PollingReturn {
    const { seconds = 5, onSuccess, onError, onFinally, ...rest } = options;

    let request: null | HttpResponse<T>;

    const interval = setInterval(async () => {
      if (request) request.abort();
      try {
        request = await this.get(path, rest);
        onSuccess?.(request);
      } catch (error) {
        onError?.(error);
      } finally {
        onFinally?.();
        request = null;
      }
    }, seconds * 1000);

    return {
      clear() {
        clearInterval(interval);
      },
    };
  }
}
