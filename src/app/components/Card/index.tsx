import { Filme } from "@/types/types";
import styles from "./Card.module.css";
import Link from "next/link";
import Image from "next/image";
import { useResumoFilme } from "@/app/hooks/useResumoFilme";
import NotaUsuario from "./NotaUsuario";
import { ReactNode } from "react";
import { getTmdbImageUrl } from "@/lib/tmdbImage";

type Props = {
  filme: Filme;
  priority?: boolean;
  highlightTerm?: string;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text: string, term?: string): ReactNode => {
  const normalizedTerm = term?.trim();

  if (!normalizedTerm) {
    return text;
  }

  const pattern = new RegExp(`(${escapeRegExp(normalizedTerm)})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) =>
    part.toLowerCase() === normalizedTerm.toLowerCase() ? (
      <mark key={`${part}-${index}`} className={styles.card__highlight}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

const getPosterBadge = (title: string) =>
  (() => {
    const words = title.trim().split(/\s+/).filter(Boolean);

    if (words.length <= 1) {
      return (words[0] || "FI").slice(0, 2).toUpperCase();
    }

    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  })();

const Card = ({ filme, priority = false, highlightTerm }: Props) => {
  const { id, title, poster_path, overview } = filme;
  const resume = useResumoFilme(overview, 256);
  const posterUrl = getTmdbImageUrl(poster_path);
  const posterBadge = getPosterBadge(title || "Filme");
  return (
    <div className={styles.card} key={id}>
      <Link className={styles.card__link} href={`/filmes/${id}`}>
        {posterUrl ? (
          <Image
            className={styles.card__poster}
            src={posterUrl}
            alt={`Poster do filme ${title}`}
            width={300}
            height={450}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div
            className={styles.card__posterPlaceholder}
            aria-label={`Pôster não disponível para ${title}`}
          >
            <span className={styles.card__posterBadge}>{posterBadge}</span>
          </div>
        )}
        <div className={styles.card__info}>
          <h3 className={styles.card__title}>
            {highlightText(title, highlightTerm)}
          </h3>
          <p className={styles.card__description}>
            {highlightText(resume, highlightTerm)}
          </p>
          <p className={styles.card__description}>
            Nota: {filme.vote_average.toFixed(1)}
          </p>
          <NotaUsuario movieId={id} />
        </div>
      </Link>
    </div>
  );
};
export default Card;
