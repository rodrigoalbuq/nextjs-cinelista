import { render, screen } from "@testing-library/react";
import Card from "./index";

jest.mock("next/link", () => {
  function MockLink({
    children,
    href,
    ...props
  }: React.PropsWithChildren<{ href: string }>) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("next/image", () => {
  function MockImage({
    alt,
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) {
    void priority;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />;
  }

  MockImage.displayName = "MockImage";
  return MockImage;
});

describe("Card", () => {
  test("destaca o termo pesquisado no titulo e na descricao", () => {
    const { container } = render(
      <Card
        filme={{
          id: 1,
          title: "Matrix",
          poster_path: "/matrix.jpg",
          overview: "Matrix mudou o cinema de ficção.",
          vote_average: 8.7,
          release_date: "1999-03-31",
        }}
        highlightTerm="mat"
      />,
    );

    expect(screen.getByText("Nota: 8.7")).toBeInTheDocument();
    expect(container.querySelectorAll("mark").length).toBeGreaterThan(0);
  });

  test("mostra fallback quando o card nao possui poster", () => {
    render(
      <Card
        filme={{
          id: 2,
          title: "Alien",
          poster_path: null,
          overview: "Terror no espaço.",
          vote_average: 8.1,
          release_date: "1979-05-25",
        }}
      />,
    );

    expect(
      screen.getByLabelText("Pôster não disponível para Alien"),
    ).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});
