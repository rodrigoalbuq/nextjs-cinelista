"use client";

import { useMovieRating } from "@/lib/movieRating";
import styles from "./Card.module.css";

type NotaUsuarioProps = {
  movieId: number;
};

const NotaUsuario = ({ movieId }: NotaUsuarioProps) => {
  const rating = useMovieRating(movieId);

  if (!rating) {
    return (
      <p className={styles.card__userRating}>Sua nota: ainda não avaliado</p>
    );
  }

  return (
    <p className={styles.card__userRating}>
      Sua nota:{" "}
      <span className={styles.card__userStars}>{"★".repeat(rating)}</span>
      <span className={styles.card__userStarsMuted}>
        {"☆".repeat(5 - rating)}
      </span>
    </p>
  );
};

export default NotaUsuario;
