const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend-e-commerce-wekg.onrender.com";

export function resolveImageUrl(src?: string): string {
  if (!src) {
    return "/placeholder.png";
  }

  let url = src.trim();

  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  if (url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }

  if (url.startsWith("/")) {
    url = `${API_BASE_URL}${url}`;
  }

  return url;
}
