import { QueueItem } from "./types";
import { Http, HttpResponse, RequestOptions } from "../Http";

export class PromiseQueue {
  private queue: QueueItem[] = [];
  private http: Http;

  constructor(httpRoot?: string, httpHeaders?: HeadersInit) {
    this.http = new Http(httpRoot, httpHeaders);
  }

  private async execute() {
    const [item] = this.queue;
    if (item) {
      const { callback, resolve, reject } = item;
      try {
        const response = await callback();
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        this.queue = this.queue.filter((i) => i !== item);
        this.execute();
      }
    }
  }

  public enqueue<T>(callback: () => Promise<T>): Promise<T> {
    return new Promise((resolve: (value: unknown) => void, reject) => {
      this.queue.push({ callback, resolve, reject });
      this.execute();
    }) as Promise<T>;
  }

  public delete<U, V extends object>(
    path: string,
    options?: RequestOptions<V>
  ): Promise<HttpResponse<U>> {
    return this.enqueue<HttpResponse<U>>(() =>
      this.http.delete<U, V>(path, options)
    );
  }

  public get<U, V extends object>(
    path: string,
    options?: RequestOptions<V>
  ): Promise<HttpResponse<U>> {
    return this.enqueue<HttpResponse<U>>(() =>
      this.http.get<U, V>(path, options)
    );
  }

  public patch<U, V extends object>(
    path: string,
    options?: RequestOptions<V>
  ): Promise<HttpResponse<U>> {
    return this.enqueue<HttpResponse<U>>(() =>
      this.http.patch<U, V>(path, options)
    );
  }

  public post<U, V extends object>(
    path: string,
    options?: RequestOptions<V>
  ): Promise<HttpResponse<U>> {
    return this.enqueue<HttpResponse<U>>(() =>
      this.http.post<U, V>(path, options)
    );
  }

  public put<U, V extends object>(
    path: string,
    options?: RequestOptions<V>
  ): Promise<HttpResponse<U>> {
    return this.enqueue<HttpResponse<U>>(() =>
      this.http.put<U, V>(path, options)
    );
  }
}
