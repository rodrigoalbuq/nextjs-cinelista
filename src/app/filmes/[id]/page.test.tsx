import { render, screen } from "@testing-library/react";
import DetalheFilme from "./page";
import { getMovieDetails } from "@/lib/api/tmdb";

jest.mock("@/lib/api/tmdb", () => ({
  getMovieDetails: jest.fn(),
}));

jest.mock("next/image", () => {
  function MockImage({
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />;
  }

  MockImage.displayName = "MockImage";
  return MockImage;
});

jest.mock("./AvaliacaoFilme", () => {
  return function AvaliacaoFilmeMock() {
    return <div>Avaliacao</div>;
  };
});

describe("DetalheFilme", () => {
  test("mostra fallback quando o filme nao possui poster e sinopse", async () => {
    (getMovieDetails as jest.Mock).mockResolvedValue({
      id: 1593800,
      title: "Teste",
      poster_path: null,
      overview: "",
      vote_average: 0,
      release_date: "2026-01-01",
    });

    render(
      await DetalheFilme({
        params: Promise.resolve({ id: 1593800 }),
      }),
    );

    expect(
      screen.getByLabelText("Pôster não disponível para Teste"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sinopse não disponível para este filme."),
    ).toBeInTheDocument();
  });
});
