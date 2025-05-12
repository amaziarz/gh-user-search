import { apiClient } from '@/utils/apiClient';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
  githubUsersSearchResponseSchema,
  type GithubUsersSearchResponse,
} from './githubApiSchema';

const getQueryKey = (username: string) => ['githubUsers', username] as const;
const PER_PAGE = 30;

type UseGithubUsersSearchParams = {
  username: string;
  enabled?: boolean;
};

export function useGithubUsersSearch({
  username,
  enabled = true,
}: UseGithubUsersSearchParams) {
  return useInfiniteQuery({
    queryKey: getQueryKey(username),
    queryFn: ({ pageParam }) => searchGithubUsers(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < PER_PAGE || lastPage.incomplete_results) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled,
  });
}

const GITHUB_API_URL = 'https://api.github.com';

export async function searchGithubUsers(
  username: string,
  page: number,
): Promise<GithubUsersSearchResponse> {
  try {
    return await apiClient({
      url: `${GITHUB_API_URL}/search/users?q=${username}&page=${page}&per_page=${PER_PAGE}`,
      schema: githubUsersSearchResponseSchema,
    });
  } catch (error) {
    console.error('Error fetching GitHub users:', error);
    throw new Error('Failed to fetch GitHub users');
  }
}
