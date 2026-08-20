import { render, screen } from "@testing-library/react";
import NotaUsuario from "./NotaUsuario";

describe("NotaUsuario", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("mostra que o filme ainda nao foi avaliado quando nao existe cache", () => {
    render(<NotaUsuario movieId={10} />);

    expect(
      screen.getByText("Sua nota: ainda não avaliado"),
    ).toBeInTheDocument();
  });

  test("mostra a quantidade de estrelas salva para o filme", () => {
    window.localStorage.setItem("movie-rating:10", "4");

    render(<NotaUsuario movieId={10} />);

    expect(screen.getByText("★★★★")).toBeInTheDocument();
    expect(screen.getByText("☆")).toBeInTheDocument();
  });
});
