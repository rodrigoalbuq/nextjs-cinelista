import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./DetalheFilme.module.css";
import { getMovieDetails } from "@/lib/api/tmdb";
import AvaliacaoFilme from "./AvaliacaoFilme";
import { getTmdbImageUrl } from "@/lib/tmdbImage";

type Props = {
  params: Promise<{
    id: number;
  }>;
};

const FALLBACK_OVERVIEW = "Sinopse não disponível para este filme.";

const getPosterBadge = (title: string) =>
  title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export const generateMetadata = async ({ params }: Props) => {
  const { id } = await params;
  //fazer cahamada da api
  const details = await getMovieDetails(id);
  if (!details) {
    return;
  }
  return {
    title: `${details.title} | Cinelista`,
    description: details.overview || FALLBACK_OVERVIEW,
    openGraph: {
      //exibir quando o link do site for compartilhado
      title: `${details.title} | Cinelista`,
      description: details.overview || FALLBACK_OVERVIEW,
      images: getTmdbImageUrl(details.poster_path, "w500")
        ? [getTmdbImageUrl(details.poster_path, "w500") as string]
        : undefined,
    },
  };
};
const DetalheFilme = async ({ params }: Props) => {
  const { id } = await params;
  //fazer cahamada da api
  const details = await getMovieDetails(id);
  if (!details) {
    return notFound();
  }

  const { title, poster_path, overview } = details;
  const posterUrl = getTmdbImageUrl(poster_path, "w500");
  const normalizedOverview = overview?.trim() || FALLBACK_OVERVIEW;
  const posterBadge = getPosterBadge(title || "Filme");

  return (
    <div className={styles.detalhes}>
      <Link className={styles.detalhes__voltar} href="/">
        <span className={styles.arrow}>←</span>
        <span className={styles.text}>Voltar</span>
      </Link>

      <div className={styles.detalhes__container}>
        {posterUrl ? (
          <Image
            className={styles.detalhes__imagem}
            src={posterUrl}
            alt={`Poster do filme ${title}`}
            width={500}
            height={750}
            priority
            loading="eager"
            fetchPriority="high"
          />
        ) : (
          <div
            className={styles.detalhes__imagemPlaceholder}
            aria-label={`Pôster não disponível para ${title}`}
          >
            <span className={styles.detalhes__imagemBadge}>{posterBadge}</span>
          </div>
        )}

        <div className={styles.detalhes__info}>
          <h2>{title}</h2>
          <p>{normalizedOverview}</p>
          <AvaliacaoFilme movieId={id} />
        </div>
      </div>
    </div>
  );
};
export default DetalheFilme;
