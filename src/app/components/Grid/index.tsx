import styles from "./Grid.module.css";
import { Filme } from "@/types/types";
import Card from "../Card";

type Props = {
  filmes: Filme[];
  highlightTerm?: string;
};
const Grid = ({ filmes, highlightTerm }: Props) => {
  return (
    <section className={styles.grid}>
      {filmes.map((filme, index) => (
        <Card
          key={filme.id}
          filme={filme}
          priority={index < 4}
          highlightTerm={highlightTerm}
        />
      ))}
    </section>
  );
};

export default Grid;
