const API_URL =
  import.meta.env.PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export interface ImageRead {
  id: number;
  name: string;
  folder: string | null;
  url: string;
}

export interface ProjectRead {
  id: number;
  name: string;
  brief_description: string;
  description: string;
  link: string;
  visible: boolean;
  url_project: string;
  image: ImageRead | null;
}

export interface PaginatedProjects {
  items: ProjectRead[];
  total: number;
  limit: number;
  offset: number;
}

export function normalizeUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export async function fetchProjects(limit = 50): Promise<ProjectRead[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/projects?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as PaginatedProjects;
    return data.items;
  } catch (error) {
    console.warn("[api] fetchProjects failed:", error);
    return [];
  }
}

export async function fetchProjectByLink(
  link: string,
): Promise<ProjectRead | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/v1/projects/link/${encodeURIComponent(link)}`,
    );
    if (!res.ok) return null;
    const project = (await res.json()) as ProjectRead;
    console.log(project);
    return project;
  } catch (error) {
    console.warn("[api] fetchProjectByLink failed:", error);
    return null;
  }
}
