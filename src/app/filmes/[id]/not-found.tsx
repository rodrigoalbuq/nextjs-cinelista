import Title from "../../components/Tiltle";
import Link from "next/link";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.notFound__container}>
      <Title title="Ops! Não encontramos o filme que você procura." />
      <p className={styles.notFound__texto}>
        Tente uma outra opção ou volte para a página inicial.
      </p>
      <Link className={styles.notFound__voltar} href="/">
        <span className={styles.arrow}>←</span>
        <span className={styles.text}>Voltar</span>
      </Link>
    </div>
  );
};

export default NotFound;
