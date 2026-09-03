export type Intent = "movie_search" | "joke" | "database_query";

export function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();

  if (lower.includes("joke") || lower.includes("funny")) {
    return "joke";
  }

  if (lower.startsWith("search movie") || lower.startsWith("find movie")) {
    return "movie_search";
  }

  return "database_query";
}