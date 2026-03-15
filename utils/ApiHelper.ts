import { APIRequestContext, APIResponse } from '@playwright/test';

/** Options for API requests */
interface RequestOptions {
  headers?: Record<string, string>;
  data?: unknown;
  params?: Record<string, string>;
}

/**
 * ApiHelper — wraps Playwright's APIRequestContext for convenient REST calls.
 */
export class ApiHelper {
  private readonly request: APIRequestContext;
  private authToken: string | null = null;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /** Set an auth token to be included in all subsequent requests */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /** Clear the auth token */
  clearAuthToken(): void {
    this.authToken = null;
  }

  /** Build headers, injecting auth token if set */
  private buildHeaders(custom?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...custom,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  // --------------- HTTP Methods ---------------

  /** Send a GET request */
  async get(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(url, {
      headers: this.buildHeaders(options?.headers),
      params: options?.params,
    });
  }

  /** Send a POST request */
  async post(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(url, {
      headers: this.buildHeaders(options?.headers),
      data: options?.data,
    });
  }

  /** Send a PUT request */
  async put(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(url, {
      headers: this.buildHeaders(options?.headers),
      data: options?.data,
    });
  }

  /** Send a PATCH request */
  async patch(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.patch(url, {
      headers: this.buildHeaders(options?.headers),
      data: options?.data,
    });
  }

  /** Send a DELETE request */
  async delete(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(url, {
      headers: this.buildHeaders(options?.headers),
    });
  }

  // --------------- Convenience ---------------

  /** Send a GET and parse the JSON response */
  async getJson<T>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.get(url, options);
    return response.json() as Promise<T>;
  }

  /** Send a POST and parse the JSON response */
  async postJson<T>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.post(url, options);
    return response.json() as Promise<T>;
  }

  /** Assert that a response has an expected status code */
  static assertStatus(response: APIResponse, expectedStatus: number): void {
    if (response.status() !== expectedStatus) {
      throw new Error(
        `Expected status ${expectedStatus}, received ${response.status()} for ${response.url()}`
      );
    }
  }
}
