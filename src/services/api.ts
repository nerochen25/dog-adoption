import { Dog } from "../types";
import { API_BASE } from "../utils/constants";

export async function login(name: string, email: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status} ${errorText}`);
  }
  return;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Logout failed: ${response.status} ${errorText}`);
  }

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

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
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
    credentials: "include",
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

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export async function fetchLocationsByZipCodes(
  zipCodes: string[]
): Promise<Location[]> {
  const API_BASE = "https://frontend-take-home-service.fetch.com";
  const response = await fetch(`${API_BASE}/locations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zipCodes),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch locations: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: Coordinates;
    left?: Coordinates;
    bottom?: Coordinates;
    right?: Coordinates;
    bottom_left?: Coordinates;
    top_left?: Coordinates;
  };
  size?: number;
  from?: number;
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

export async function searchLocations(
  params: LocationSearchParams = {}
): Promise<LocationSearchResponse> {
  const API_BASE = "https://frontend-take-home-service.fetch.com";
  const response = await fetch(`${API_BASE}/locations/search`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to search locations: ${response.status} ${errorText}`
    );
  }

  return response.json();
}
