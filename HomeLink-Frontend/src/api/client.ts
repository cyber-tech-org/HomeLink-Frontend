const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    token?: string;
    headers?: Record<string, string>;
}

const buildUrl = (path: string): string => {
    if (!API_BASE_URL) {
        return path;
    }

    return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const message =
            (typeof payload === 'object' && payload !== null && 'message' in payload && String(payload.message)) ||
            (typeof payload === 'string' && payload) ||
            `Request failed with status ${response.status}`;
        throw new Error(message);
    }

    return payload as T;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    const { method = 'GET', body, token, headers = {} } = options;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const response = await fetch(buildUrl(path), {
        method,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body == null || method === 'GET' ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });

    return parseResponse<T>(response);
};

