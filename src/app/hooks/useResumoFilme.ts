import { useMemo } from "react";

export function useResumoFilme(overview: string, max = 180) {
  return useMemo(() => {
    if (overview.length <= max) {
      return overview;
    }
    return overview.slice(0, max) + "...";
  }, [overview, max]);
}
