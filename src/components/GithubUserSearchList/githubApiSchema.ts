import * as yup from 'yup';

const githubUserSchema = yup
  .object({
    id: yup.number().required(),
    login: yup.string().required(),
    avatar_url: yup.string().url().required(),
    html_url: yup.string().url().required(),
    type: yup.string().required(),
  })
  .required();

const githubUserListSchema = yup.array(githubUserSchema).required();

export const githubUserSearchResponseSchema = yup
  .object({
    incomplete_results: yup.boolean().required(),
    items: githubUserListSchema,
    total_count: yup.number().required(),
  })
  .required();

export type GithubUserSearchResponse = yup.InferType<
  typeof githubUserSearchResponseSchema
>;

export type GithubUser = yup.InferType<typeof githubUserSchema>;
