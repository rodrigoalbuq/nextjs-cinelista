import tmdbApi from "./axios";
import { getTrendindMovies, searchMoviesByTitle } from "./tmdb";

jest.mock("./axios");

test("Retorna filmes em destaque corretamente", async () => {
  //AAA - Arrange, Act, Assert tipo de teste

  //Arrange - arranjo
  const mockResults = [{ id: 1, title: "Filme 1" }];
  const mockedTmdbApi = tmdbApi as jest.Mocked<typeof tmdbApi>;
  mockedTmdbApi.get.mockResolvedValue({
    data: { results: mockResults },
  }); // Mock da resposta da API

  //Act - chamada da ação que eu quero testar
  const filmes = await getTrendindMovies();

  //Assert - garanto que o resultado é o esperado
  expect(filmes).toEqual(mockResults);
});

test("Busca filmes pelo titulo corretamente", async () => {
  const mockResults = [{ id: 2, title: "Matrix" }];
  const mockedTmdbApi = tmdbApi as jest.Mocked<typeof tmdbApi>;
  mockedTmdbApi.get.mockResolvedValue({
    data: { results: mockResults },
  });

  const filmes = await searchMoviesByTitle("Matrix");

  expect(mockedTmdbApi.get).toHaveBeenCalledWith("/search/movie", {
    params: {
      language: "pt-BR",
      query: "Matrix",
    },
  });
  expect(filmes).toEqual(mockResults);
});
