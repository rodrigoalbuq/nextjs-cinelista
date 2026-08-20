import { useSyncExternalStore } from "react";

export const STORAGE_KEY_PREFIX = "movie-rating";
const STORAGE_EVENT = "movie-rating-change";

export const getMovieRatingStorageKey = (movieId: number) =>
  `${STORAGE_KEY_PREFIX}:${movieId}`;

const readMovieRating = (movieId: number) => {
  if (typeof window === "undefined") {
    return 0;
  }

  const savedRating = window.localStorage.getItem(
    getMovieRatingStorageKey(movieId),
  );
  const parsedRating = Number(savedRating);

  return parsedRating >= 1 && parsedRating <= 5 ? parsedRating : 0;
};

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener(STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(STORAGE_EVENT, handleChange);
  };
};

export const emitMovieRatingChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export const setMovieRating = (movieId: number, rating: number) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getMovieRatingStorageKey(movieId),
    String(rating),
  );
  emitMovieRatingChange();
};

export const useMovieRating = (movieId: number) =>
  useSyncExternalStore(
    subscribe,
    () => readMovieRating(movieId),
    () => 0,
  );
