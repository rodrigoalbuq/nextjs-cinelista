import Grid from "@/app/components/Grid";
import Title from "@/app/components/Title";
import { getTopMovies } from "@/lib/api/tmdb";
// Gerar página estática para evitar chamadas repetidas à API, já que os top filmes não mudam com frequência. Vai ser atualizado somente em novas builds.
export const dynamic = "force-static";
const TopFilmes = async () => {
  const filmes = await getTopMovies();
  return (
    <>
      <Title title="Top Filmes" />
      <Grid filmes={filmes} />
    </>
  );
};
export default TopFilmes;
