import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Title from "./index";

test("renderiza o titulo com o texto correto", async () => {
  const titulo = "Titulo";

  render(<Title title={titulo} />); //renderiza o componente com a prop titulo

  const elemento = await screen.findByText(titulo); //busca o elemento pelo texto

  expect(elemento).toBeInTheDocument(); //verifica se o elemento esta no documento
});
