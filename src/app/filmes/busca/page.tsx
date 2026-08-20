import Grid from "@/app/components/Grid";
import Title from "@/app/components/Title";
import { searchMoviesByTitle } from "@/lib/api/tmdb";

type BuscaPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const dynamic = "force-dynamic";

const BuscaFilmesPage = async ({ searchParams }: BuscaPageProps) => {
  const { q } = await searchParams;
  const termo = q?.trim() ?? "";
  const filmes = termo ? await searchMoviesByTitle(termo) : [];

  return (
    <>
      <Title title={termo ? `Resultados para ${termo}` : "Buscar filmes"} />

      {termo ? (
        filmes.length > 0 ? (
          <Grid filmes={filmes} highlightTerm={termo} />
        ) : (
          <p style={{ textAlign: "center" }}>
            Nenhum filme encontrado para {termo}.
          </p>
        )
      ) : (
        <p style={{ textAlign: "center" }}>
          Clique na lupa e digite o título de um filme para pesquisar.
        </p>
      )}
    </>
  );
};

export default BuscaFilmesPage;
