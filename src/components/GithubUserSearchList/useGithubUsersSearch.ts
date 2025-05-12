import { client } from '@/utils/apiClient';
import { useInfiniteQuery } from '@tanstack/react-query';

import type { GithubUser } from './types';

type GithubUserSearchResponse = {
  incomplete_results: boolean;
  items: GithubUser[];
  total_count: number;
};

const getQueryKey = (username: string) => ['githubUsers', username] as const;
const PER_PAGE = 30;

export function useGithubUsersSearch(username: string) {
  return useInfiniteQuery({
    queryKey: getQueryKey(username),
    queryFn: ({ pageParam = 1 }) => searchGithubUsers(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < PER_PAGE || lastPage.incomplete_results) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: !!username,
  });
}

const GITHUB_API_URL = 'https://api.github.com';

function searchGithubUsers(
  username: string,
  page: number,
): Promise<GithubUserSearchResponse> {
  return client<GithubUserSearchResponse>(
    `${GITHUB_API_URL}/search/users?q=${username}&page=${page}&per_page=${PER_PAGE}`,
  );
}
