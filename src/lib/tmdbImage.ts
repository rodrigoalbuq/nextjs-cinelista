const TMDB_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_TMDB_API_IMG_URL || "https://image.tmdb.org/t/p/w300";

export const getTmdbImageUrl = (
  posterPath?: string | null,
  size: "w300" | "w500" = "w300",
) => {
  if (!posterPath) {
    return null;
  }

  const normalizedBaseUrl = TMDB_IMAGE_BASE_URL.replace(/\/w\d+$/, `/${size}`);

  return `${normalizedBaseUrl}${posterPath}`;
};
