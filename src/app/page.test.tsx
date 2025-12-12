import { render, screen } from "@testing-library/react";
import Home from "./page";
import { getTrendindMovies } from "./../lib/api/tmdb";

jest.mock("./../lib/api/tmdb", () => ({
  getTrendindMovies: jest.fn(),
}));

test("Exibe o titulo 'Filmes em destaque'na página inicial corretamente ", async () => {
  const titulo = "Filmes em destaque";

  // Mock da função para retornar um array vazio
  (getTrendindMovies as jest.Mock).mockResolvedValue([]);

  render(await Home());
  // verifica se o titulo dessa sessão aparece corretamente
  expect(screen.getByText(titulo)).toBeInTheDocument();
});

test("Renderiza os filmes em destaque corretamente", async () => {
  (getTrendindMovies as jest.Mock).mockResolvedValue([
    {
      id: 1,
      title: "Filme teste",
      overview: "Descrição do filme teste",
      poster_path: "public/next.svg",
      vote_average: 8.0,
    },
  ]);

  //Renderiza a página (internamente chama a função getTrendingMovies)
  render(await Home());
  //verifica se o filme renderizado aparece na tela
  expect(await screen.findByText("Filme teste")).toBeInTheDocument();
});

test("Exibe mensagem quando não houver filmes disponiveis", async () => {
  (getTrendindMovies as jest.Mock).mockResolvedValue([]);

  render(await Home());
  expect(
    await screen.findByText("Nenhum filme disponível"),
  ).toBeInTheDocument();
});
