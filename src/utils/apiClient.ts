import * as yup from 'yup';

type ApiClientParams<T> = {
  url: string;
  schema?: yup.Schema<T>;
  options?: RequestInit;
};

export async function apiClient<T>({
  url,
  schema,
  options,
}: ApiClientParams<T>): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data: unknown = await res.json();
  if (schema) {
    try {
      return await schema.validate(data);
    } catch (error) {
      console.error('API response validation error:', error);
      throw new Error('Invalid API response');
    }
  }
  return data as T;
}
