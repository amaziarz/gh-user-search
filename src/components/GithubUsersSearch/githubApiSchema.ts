import * as yup from 'yup';

const githubUserSchema = yup.object({
  id: yup.number().required(),
  login: yup.string().required(),
  avatar_url: yup.string().url().required(),
  html_url: yup.string().url().required(),
  type: yup.string().required(),
});

export const githubUsersSearchResponseSchema = yup.object({
  incomplete_results: yup.boolean().required(),
  items: yup.array(githubUserSchema).required(),
  total_count: yup.number().required(),
});

export type GithubUsersSearchResponse = yup.InferType<
  typeof githubUsersSearchResponseSchema
>;

export type GithubUser = yup.InferType<typeof githubUserSchema>;
