import { getTrendindMovies } from "@/lib/api/tmdb";
import Grid from "./components/Grid";
import Title from "./components/Tiltle";

export default async function Home() {
  const filmes = await getTrendindMovies();
  return (
    <>
      <Title title="Filmes em destaque" />
      <Grid filmes={filmes} />
    </>
  );
}
