export type ApiRequest = {
  message: string;
  type?: string;
};

export async function apiRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: object,
  authRequired: 'AUTH' | 'NO_AUTH' = 'AUTH',
): Promise<T> {
  let token: string | null = null;

  if (authRequired === 'AUTH') {
    token = localStorage.getItem('token');

    if (!token) throw new Error('User is not logged in');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authRequired === 'AUTH') headers['Authorization'] = `Bearer ${token}`;

  const response: Response = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, {
    method: method,
    headers: headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Something went wrong');

  return data;
}
