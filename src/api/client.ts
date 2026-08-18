import { Article, Profile, User } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

function getToken(): string | null {
  return localStorage.getItem("jwt");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  if (options.headers && typeof options.headers === "object") {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export async function login(email: string, password: string): Promise<User> {
  const data = await request<{ user: User }>("/users/login", {
    method: "POST",
    body: JSON.stringify({ user: { email, password } }),
  });
  return data.user;
}

export async function getCurrentUser(): Promise<User> {
  const data = await request<{ user: User }>("/user");
  return data.user;
}

export async function getArticles(params?: {
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; articlesCount: number }> {
  const searchParams = new URLSearchParams();
  if (params?.author) searchParams.set("author", params.author);
  if (params?.favorited) searchParams.set("favorited", params.favorited);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));

  const query = searchParams.toString();
  return request(`/articles${query ? `?${query}` : ""}`);
}

export async function getArticle(slug: string): Promise<Article> {
  const data = await request<{ article: Article }>(`/articles/${slug}`);
  return data.article;
}

export async function getProfile(username: string): Promise<Profile> {
  const data = await request<{ profile: Profile }>(`/profiles/${username}`);
  return data.profile;
}

export async function followUser(username: string): Promise<Profile> {
  const data = await request<{ profile: Profile }>(`/profiles/${username}/follow`, {
    method: "POST",
  });
  return data.profile;
}

export async function unfollowUser(username: string): Promise<Profile> {
  const data = await request<{ profile: Profile }>(`/profiles/${username}/follow`, {
    method: "DELETE",
  });
  return data.profile;
}

export async function favoriteArticle(slug: string): Promise<Article> {
  const data = await request<{ article: Article }>(`/articles/${slug}/favorite`, {
    method: "POST",
  });
  return data.article;
}

export async function unfavoriteArticle(slug: string): Promise<Article> {
  const data = await request<{ article: Article }>(`/articles/${slug}/favorite`, {
    method: "DELETE",
  });
  return data.article;
}
