import net from "node:net";
import { setDefaultResultOrder } from "node:dns";

// Forzar IPv4 en SSR: hosts con AAAA (Cloudflare, etc.) fallan el fetch
// cuando el entorno no puede rutar IPv6 (WSL sin IPv6, algunos CI).
// - setDefaultResultOrder: pone IPv4 primero en lookups DNS.
// - setDefaultAutoSelectFamily(false): desactiva Happy Eyeballs v2 para que
//   Node no corra IPv4 + IPv6 en paralelo — un ENETUNREACH del IPv6 aborta
//   también el intento IPv4 vía AggregateError, aunque IPv4 sí sería alcanzable.
// En el Workers runtime de Cloudflare estas APIs no existen; se ignoran con try/catch.
try { setDefaultResultOrder("ipv4first"); } catch { /* Workers runtime */ }
try { net.setDefaultAutoSelectFamily(false); } catch { /* Workers runtime */ }

const API_URL =
  import.meta.env.PUBLIC_API_URL?.replace(/\/$/, "") ??
  "https://api.luifereduardoo.com";

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

export interface AuthorBrief {
  id: number;
  name: string;
  email: string;
}

export interface BlogPostRead {
  id: number;
  title: string;
  content: string;
  link: string;
  reading_time: string | null;
  visible: boolean;
  user: AuthorBrief;
  cover_image: ImageRead | null;
  authors: AuthorBrief[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedBlogPosts {
  items: BlogPostRead[];
  total: number;
  limit: number;
  offset: number;
}

export function parseReadingMinutes(
  value: string | null | undefined,
): number {
  if (!value) return 0;
  const parts = value.split(":").map((p) => Number(p));
  if (parts.some(Number.isNaN)) return 0;
  const [h = 0, m = 0, s = 0] = parts;
  const total = h * 60 + m + (s >= 30 ? 1 : 0);
  return Math.max(total, 1);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    return project;
  } catch (error) {
    console.warn("[api] fetchProjectByLink failed:", error);
    return null;
  }
}

export async function fetchBlogPosts(limit = 3): Promise<BlogPostRead[]> {
  const page = await fetchBlogPostsPage(limit, 0);
  return page.items;
}

export async function fetchBlogPostsPage(
  limit = 10,
  offset = 0,
): Promise<PaginatedBlogPosts> {
  try {
    const res = await fetch(
      `${API_URL}/api/v1/blog-posts?limit=${limit}&offset=${offset}`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as PaginatedBlogPosts;
  } catch (error) {
    console.warn("[api] fetchBlogPostsPage failed:", error);
    return { items: [], total: 0, limit, offset };
  }
}

export async function fetchBlogPostByLink(
  link: string,
): Promise<BlogPostRead | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/v1/blog-posts/link/${encodeURIComponent(link)}`,
    );
    if (!res.ok) return null;
    return (await res.json()) as BlogPostRead;
  } catch (error) {
    console.warn("[api] fetchBlogPostByLink failed:", error);
    return null;
  }
}
