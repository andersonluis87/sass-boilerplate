import { env } from "@sass-boiler-plate/env/server";
import { z } from "zod";

const GithubAccessTokenSchema = z.object({
	access_token: z.string(),
	token_type: z.literal("bearer"),
	scope: z.string(),
});

const GithubUserSchema = z.object({
	id: z.number().int().transform(String),
	avatar_url: z.url(),
	name: z.string().optional(),
	email: z.email(),
});

export type GithubUser = z.infer<typeof GithubUserSchema>;

export const exchangeCodeForAccessToken = async (code: string) => {
	const githubOauthURL = new URL(
		"https://github.com/login/oauth/access_token",
	);
	githubOauthURL.searchParams.append("client_id", env.GITHUB_CLIENT_ID);
	githubOauthURL.searchParams.append(
		"client_secret",
		env.GITHUB_CLIENT_SECRET,
	);
	githubOauthURL.searchParams.append(
		"redirect_uri",
		env.GITHUB_REDIRECT_URI,
	);
	githubOauthURL.searchParams.append("code", code);

	const githubAccessTokenResponse = await fetch(githubOauthURL.toString(), {
		method: "POST",
		headers: {
			Accept: "application/json",
		},
	});

	const githubAccessTokenData = await githubAccessTokenResponse.json();
	const { access_token: accessToken } =
		GithubAccessTokenSchema.parse(githubAccessTokenData);

	return accessToken;
};

export const getGithubUser = async (accessToken: string) => {
	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	const githubUserData = await githubUserResponse.json();

	return GithubUserSchema.parse(githubUserData);
};
