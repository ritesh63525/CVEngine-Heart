import {
  API_CONFIG,
} from './apiConfig';

export type ApiData = {
  status?: boolean;
  message?: string;
  detail?: string;
  [key: string]: unknown;
};

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  token?: string;
};

export class ApiError extends Error {
  statusCode: number;
  data: ApiData | null;

  constructor(
    message: string,
    statusCode = 0,
    data: ApiData | null = null,
  ) {
    super(message);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

function extractErrorMessage(
  data: ApiData | null,
): string {
  if (!data) {
    return 'Server se valid response nahi mila.';
  }

  if (
    typeof data.message === 'string' &&
    data.message.trim()
  ) {
    return data.message;
  }

  if (
    typeof data.detail === 'string' &&
    data.detail.trim()
  ) {
    return data.detail;
  }

  /*
   * Django validation errors:
   *
   * {
   *   "phone": ["Invalid phone number"]
   * }
   */
  for (const value of Object.values(data)) {
    if (
      typeof value === 'string' &&
      value.trim()
    ) {
      return value;
    }

    if (
      Array.isArray(value) &&
      typeof value[0] === 'string'
    ) {
      return value[0];
    }
  }

  return 'Request cannot be completed.';
}

export async function apiRequest<
  TResponse extends ApiData,
>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const controller =
    new AbortController();

  const timeoutId = setTimeout(
    () => controller.abort(),
    API_CONFIG.TIMEOUT_MS,
  );

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  /*
   * Backend ke Postman collection mein
   * token direct Authorization header mein
   * bheja ja raha hai, "Bearer" prefix ke bina.
   */
  if (options.token) {
    headers.Authorization =
      options.token;
  }

  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${endpoint}`,
      {
        method:
          options.method ?? 'GET',

        headers,

        body:
          options.body !== undefined
            ? JSON.stringify(
                options.body,
              )
            : undefined,

        signal: controller.signal,
      },
    );

    const responseText =
      await response.text();

    let data: ApiData | null = null;

    if (responseText.trim()) {
      try {
        data = JSON.parse(
          responseText,
        ) as ApiData;
      } catch {
        throw new ApiError(
          'Invalid response from the server.',
          response.status,
          null,
        );
      }
    }

    if (
      !response.ok ||
      data?.status === false
    ) {
      throw new ApiError(
        extractErrorMessage(data),
        response.status,
        data,
      );
    }

    if (!data) {
      throw new ApiError(
        'No Response from the server.',
        response.status,
        null,
      );
    }

    return data as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw new ApiError(
        'Try again.',
      );
    }

    throw new ApiError(
      'Unable to connect with the server.',
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getApiErrorMessage(
  error: unknown,
): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Try again.';
}