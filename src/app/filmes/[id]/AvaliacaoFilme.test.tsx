import { fireEvent, render, screen } from "@testing-library/react";
import AvaliacaoFilme from "./AvaliacaoFilme";
import { getMovieRatingStorageKey } from "@/lib/movieRating";

describe("AvaliacaoFilme", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("salva a nota escolhida no cache do usuario", () => {
    render(<AvaliacaoFilme movieId={42} />);

    fireEvent.click(screen.getByLabelText("Classificar com 4 estrelas"));

    expect(window.localStorage.getItem(getMovieRatingStorageKey(42))).toBe("4");
  });

  test("recupera a nota salva ao abrir novamente o filme", () => {
    window.localStorage.setItem(getMovieRatingStorageKey(7), "5");

    render(<AvaliacaoFilme movieId={7} />);

    expect(screen.getByLabelText("Classificar com 5 estrelas")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
