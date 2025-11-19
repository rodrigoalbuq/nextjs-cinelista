import Grid from "@/app/components/Grid";
import Title from "@/app/components/Tiltle";
import { getPopularMovies } from "@/lib/api/tmdb";

export const dynamic = "force-dynamic"; //  Permitir atualizações frequentes para refletir as mudanças nos filmes em alta.
const FilmesEmAlta = async () => {
  const filmes = await getPopularMovies();

  return (
    <>
      <Title title="Filmes em Alta" />
      <Grid filmes={filmes} />
    </>
  );
};
export default FilmesEmAlta;
