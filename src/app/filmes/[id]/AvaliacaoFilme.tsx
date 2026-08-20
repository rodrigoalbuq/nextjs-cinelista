"use client";

import { setMovieRating, useMovieRating } from "@/lib/movieRating";
import styles from "./DetalheFilme.module.css";

type AvaliacaoFilmeProps = {
  movieId: number;
};

const AvaliacaoFilme = ({ movieId }: AvaliacaoFilmeProps) => {
  const rating = useMovieRating(movieId);

  const handleRatingChange = (value: number) => {
    setMovieRating(movieId, value);
  };

  return (
    <section className={styles.avaliacao} aria-label="Avaliação do filme">
      <p className={styles.avaliacao__titulo}>Sua classificação</p>

      <div className={styles.avaliacao__estrelas}>
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = value <= rating;

          return (
            <button
              key={value}
              type="button"
              className={`${styles.avaliacao__estrela} ${
                isActive ? styles["avaliacao__estrela--ativa"] : ""
              }`}
              onClick={() => handleRatingChange(value)}
              aria-label={`Classificar com ${value} estrela${value > 1 ? "s" : ""}`}
              aria-pressed={isActive}
            >
              ★
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default AvaliacaoFilme;
