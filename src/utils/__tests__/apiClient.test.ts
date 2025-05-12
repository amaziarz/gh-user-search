import { server } from '@/test/server';
import { http, HttpResponse } from 'msw';
import { test, expect, vi } from 'vitest';
import * as yup from 'yup';

import { apiClient } from '../apiClient';

const mockUrl = 'https://api.example.com/data';

test('should throw the status text as error when response is not ok', async () => {
  server.use(
    http.get(mockUrl, () => {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }),
  );

  await expect(apiClient({ url: mockUrl })).rejects.toThrow('Not Found');
});

test('should validate response data with the provided schema', async () => {
  const mockData = { name: 'test', id: 123 };

  server.use(
    http.get(mockUrl, () => {
      return HttpResponse.json(mockData);
    }),
  );

  const schema = yup.object({
    name: yup.string().required(),
    id: yup.number().required(),
  });

  const validateSpy = vi.spyOn(schema, 'validate');
  validateSpy.mockResolvedValueOnce(mockData);

  const result = await apiClient({
    url: mockUrl,
    schema,
  });

  expect(validateSpy).toHaveBeenCalledWith(mockData);
  expect(result).toEqual(mockData);
});

test('should throw error when validation fails', async () => {
  const mockData = { name: 'test' };

  server.use(
    http.get(mockUrl, () => {
      return HttpResponse.json(mockData);
    }),
  );

  const schema = yup.object({
    name: yup.string().required(),
    id: yup.number().required(),
  });

  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementationOnce(vi.fn());

  await expect(
    apiClient({
      url: mockUrl,
      schema,
    }),
  ).rejects.toThrow('Invalid API response');
  expect(consoleErrorSpy).toHaveBeenCalled();
});
