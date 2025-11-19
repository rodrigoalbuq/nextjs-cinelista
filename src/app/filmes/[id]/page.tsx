import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./DetalheFilme.module.css";
import { getMovieDetails } from "@/lib/api/tmdb";

type Props = {
  params: Promise<{
    id: number;
  }>;
};

export const generateMetadata = async ({ params }: Props) => {
  const { id } = await params;
  //fazer cahamada da api
  const details = await getMovieDetails(id);
  if (!details) {
    return;
  }
  return {
    title: `${details.title} | Cinelista`,
    description: details.overview,
    openGraph: {
      //exibir quando o link do site for compartilhado
      title: `${details.title} | Cinelista`,
      description: details.overview,
      images: [
        `${process.env.NEXT_PUBLIC_TMDB_API_IMG_URL}${details.poster_path}`,
      ],
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

  return (
    <div className={styles.detalhes}>
      <Link className={styles.detalhes__voltar} href="/">
        <span className={styles.arrow}>←</span>
        <span className={styles.text}>Voltar</span>
      </Link>

      <div className={styles.detalhes__container}>
        <Image
          className={styles.detalhes__imagem}
          src={`${process.env.NEXT_PUBLIC_TMDB_API_IMG_URL}${poster_path}`}
          alt={`Poster do filme ${title}`}
          width={500}
          height={750}
        />

        <div className={styles.detalhes__info}>
          <h2>{title}</h2>
          <p>{overview}</p>
        </div>
      </div>
    </div>
  );
};
export default DetalheFilme;
