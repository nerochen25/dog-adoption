import { Dog } from "../types";

const API_BASE = "https://frontend-take-home-service.fetch.com";

export async function login(name: string, email: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Ensure cookies are sent and received
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    // Optionally, you can log the response status or text here for debugging.
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status} ${errorText}`);
  }
  // No need to parse response body because the auth cookie is set automatically.
  return;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include", // ensure cookies are sent
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Logout failed: ${response.status} ${errorText}`);
  }

  // The logout endpoint returns plain text ("OK"), so we don't parse JSON.
  // If needed, you could also do:
  // const text = await response.text();
  // console.log('Logout response:', text);

  return;
}

export async function fetchBreeds(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/dogs/breeds`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch breeds");
  }
  return response.json();
}

// src/services/api.ts

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string; // e.g., 'breed:asc', 'name:desc', etc.
}

export interface SearchResponse {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

export async function searchDogs(
  paramsOrUrl: SearchParams | string
): Promise<SearchResponse> {
  let url: string;

  if (typeof paramsOrUrl === "string") {
    // If a string is provided, assume it's a relative URL returned by the API.
    url = `${API_BASE}${paramsOrUrl}`;
  } else {
    // Build a query string from the parameters.
    const query = new URLSearchParams();

    if (paramsOrUrl.breeds && paramsOrUrl.breeds.length > 0) {
      paramsOrUrl.breeds.forEach((breed) => query.append("breeds", breed));
    }
    if (paramsOrUrl.zipCodes && paramsOrUrl.zipCodes.length > 0) {
      paramsOrUrl.zipCodes.forEach((zip) => query.append("zipCodes", zip));
    }
    if (paramsOrUrl.ageMin !== undefined) {
      query.append("ageMin", paramsOrUrl.ageMin.toString());
    }
    if (paramsOrUrl.ageMax !== undefined) {
      query.append("ageMax", paramsOrUrl.ageMax.toString());
    }
    if (paramsOrUrl.size !== undefined) {
      query.append("size", paramsOrUrl.size.toString());
    }
    if (paramsOrUrl.from) {
      query.append("from", paramsOrUrl.from);
    }
    if (paramsOrUrl.sort) {
      query.append("sort", paramsOrUrl.sort);
    }

    url = `${API_BASE}/dogs/search?${query.toString()}`;
  }

  const response = await fetch(url, {
    method: "GET",
    credentials: "include", // Include cookies, etc.
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to search dogs: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getDogs(dogIds: string[]): Promise<Dog[]> {
  const response = await fetch(`${API_BASE}/dogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(dogIds),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch dog details");
  }
  return response.json();
}

interface MatchResponse {
  match: string;
}

export async function matchDogs(favoriteIds: string[]): Promise<MatchResponse> {
  const response = await fetch(`${API_BASE}/dogs/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(favoriteIds),
  });
  if (!response.ok) {
    throw new Error("Failed to generate match");
  }
  return response.json();
}
