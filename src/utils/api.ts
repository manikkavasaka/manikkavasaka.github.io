const getApiBaseUrl = () => {
  const envUrl = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  return 'http://127.0.0.1:4000';
};

export const apiBaseUrl = getApiBaseUrl();

export async function getJson<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const rawText = await response.text();
    let data: any = null;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      if (!response.ok) {
        throw new Error(`Backend returned non-JSON response: ${rawText || response.statusText}`);
      }
      throw new Error('Invalid JSON response from backend');
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Request failed');
    }

    return data as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Backend not reachable. Run: node backend/server.js');
    }
    throw error;
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const rawText = await response.text();
    let data: any = null;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      if (!response.ok) {
        throw new Error(`Backend returned non-JSON response: ${rawText || response.statusText}`);
      }
      throw new Error('Invalid JSON response from backend');
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Request failed');
    }

    return data as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Backend not reachable. Run: node backend/server.js');
    }
    throw error;
  }
}

export async function patchJson<T>(path: string, body: unknown): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const rawText = await response.text();
    let data: any = null;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      if (!response.ok) {
        throw new Error(`Backend returned non-JSON response: ${rawText || response.statusText}`);
      }
      throw new Error('Invalid JSON response from backend');
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Request failed');
    }

    return data as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Backend not reachable. Run: node backend/server.js');
    }
    throw error;
  }
}

export async function deleteJson<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const rawText = await response.text();
    let data: any = null;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      if (!response.ok) {
        throw new Error(`Backend returned non-JSON response: ${rawText || response.statusText}`);
      }
      throw new Error('Invalid JSON response from backend');
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Request failed');
    }

    return data as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Backend not reachable. Run: node backend/server.js');
    }
    throw error;
  }
}

