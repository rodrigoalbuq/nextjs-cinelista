import Grid from "@/app/components/Grid";
import Title from "@/app/components/Tiltle";
import { getPopularMovies } from "@/lib/api/tmdb";

export const revalidate = 60; // Atualiza a cada 60 segundos para manter os filmes populares atualizados.
const FilmesPopulares = async () => {
  const filmes = await getPopularMovies();

  return (
    <>
      <Title title="Filmes Populares" />
      <Grid filmes={filmes} />
    </>
  );
};
export default FilmesPopulares;
