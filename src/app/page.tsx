import { getTrendindMovies } from "@/lib/api/tmdb";
import Grid from "./components/Grid";
import Title from "./components/Title";

export default async function Home() {
  const filmes = await getTrendindMovies();
  return (
    <>
      <Title title="Filmes em destaque" />
      {filmes && filmes.length > 0 ? (
        <Grid filmes={filmes} />
      ) : (
        <p style={{ textAlign: "center" }}>Nenhum filme disponível</p>
      )}
    </>
  );
}
