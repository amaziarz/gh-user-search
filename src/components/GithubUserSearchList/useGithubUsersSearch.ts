import { client } from '@/utils/apiClient';
import { useQuery } from '@tanstack/react-query';

export type GithubUser = {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  score: number;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
  user_view_type: string;
};

const getQueryKey = (username: string) => ['githubUsers', username] as const;

export function useGithubUsersSearch(username: string) {
  return useQuery({
    enabled: !!username,
    queryFn: () => searchGithubUsers(username, 1),
    queryKey: getQueryKey(username),
  });
}

const GITHUB_API_URL = 'https://api.github.com';

type GithubUserSearchResponse = {
  incomplete_results: boolean;
  items: GithubUser[];
  total_count: number;
};

async function searchGithubUsers(
  username: string,
  page: number,
): Promise<GithubUser[]> {
  const res = await client<GithubUserSearchResponse>(
    `${GITHUB_API_URL}/search/users?q=${username}&page=${parseInt(page)}`,
  );
  return res.items;
}
