import { act, fireEvent, render, screen } from "@testing-library/react";
import Header from "./index";

const pushMock = jest.fn();
const searchParamsMock = new URLSearchParams();
const fetchMock = jest.fn();

global.fetch = fetchMock;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => "/",
  useSearchParams: () => searchParamsMock,
}));

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
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />;
  }

  MockImage.displayName = "MockImage";
  return MockImage;
});

describe("Header", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    pushMock.mockClear();
    fetchMock.mockReset();
    window.localStorage.clear();
  });

  test("abre a busca ao clicar na lupa", () => {
    render(<Header initialTheme="light" />);

    fireEvent.click(screen.getByLabelText("Abrir busca"));

    expect(screen.getByPlaceholderText("Buscar por título")).toHaveFocus();
  });

  test("envia a pesquisa pelo titulo informado", () => {
    render(<Header initialTheme="light" />);

    fireEvent.click(screen.getByLabelText("Abrir busca"));
    fireEvent.change(screen.getByPlaceholderText("Buscar por título"), {
      target: { value: "Cidade de Deus" },
    });
    fireEvent.click(screen.getByLabelText("Pesquisar filme"));

    expect(pushMock).toHaveBeenCalledWith("/filmes/busca?q=Cidade%20de%20Deus");
  });

  test("mostra sugestoes automaticamente enquanto o usuario digita", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Matrix",
          poster_path: "/matrix.jpg",
          overview: "",
          vote_average: 8.7,
          release_date: "1999-03-31",
        },
      ],
    });

    render(<Header initialTheme="light" />);

    fireEvent.click(screen.getByLabelText("Abrir busca"));
    fireEvent.change(screen.getByPlaceholderText("Buscar por título"), {
      target: { value: "Matrix" },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(await screen.findByText("Matrix")).toBeInTheDocument();
  });

  test("limpa o termo pesquisado ao clicar no botao de limpar", () => {
    render(<Header initialTheme="light" />);

    fireEvent.click(screen.getByLabelText("Abrir busca"));
    fireEvent.change(screen.getByPlaceholderText("Buscar por título"), {
      target: { value: "Interestelar" },
    });
    fireEvent.click(screen.getByLabelText("Limpar busca"));

    expect(screen.getByPlaceholderText("Buscar por título")).toHaveValue("");
  });

  test("fecha as sugestoes ao clicar fora da busca", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Matrix",
          poster_path: "/matrix.jpg",
          overview: "",
          vote_average: 8.7,
          release_date: "1999-03-31",
        },
      ],
    });

    render(<Header initialTheme="light" />);

    fireEvent.click(screen.getByLabelText("Abrir busca"));
    fireEvent.change(screen.getByPlaceholderText("Buscar por título"), {
      target: { value: "Matrix" },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(await screen.findByText("Matrix")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("Matrix")).not.toBeInTheDocument();
  });

  test("permite navegar nas sugestoes com teclado e abrir com enter", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Matrix",
          poster_path: "/matrix.jpg",
          overview: "",
          vote_average: 8.7,
          release_date: "1999-03-31",
        },
        {
          id: 2,
          title: "Matrix Reloaded",
          poster_path: "/matrix-reloaded.jpg",
          overview: "",
          vote_average: 7.2,
          release_date: "2003-05-15",
        },
      ],
    });

    render(<Header initialTheme="light" />);

    fireEvent.click(screen.getByLabelText("Abrir busca"));
    const input = screen.getByPlaceholderText("Buscar por título");
    fireEvent.change(input, {
      target: { value: "Matrix" },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(pushMock).toHaveBeenCalledWith("/filmes/2");
  });

  test("renderiza mini-poster nas sugestoes", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Matrix",
          poster_path: "/matrix.jpg",
          overview: "",
          vote_average: 8.7,
          release_date: "1999-03-31",
        },
      ],
    });

    render(<Header initialTheme="light" />);

    fireEvent.click(screen.getByLabelText("Abrir busca"));
    fireEvent.change(screen.getByPlaceholderText("Buscar por título"), {
      target: { value: "Matrix" },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(await screen.findByAltText("Poster de Matrix")).toBeInTheDocument();
  });

  test("fecha o campo inteiro de busca ao pressionar escape", () => {
    render(<Header initialTheme="light" />);

    fireEvent.click(screen.getByLabelText("Abrir busca"));
    const input = screen.getByPlaceholderText("Buscar por título");
    fireEvent.change(input, {
      target: { value: "Batman" },
    });
    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.getByLabelText("Abrir busca")).toBeInTheDocument();
    expect(screen.queryByLabelText("Pesquisar filme")).not.toBeInTheDocument();
  });

  test("renderiza fallback elegante quando a sugestao nao possui poster", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 3,
          title: "Alien",
          poster_path: "",
          overview: "",
          vote_average: 8.1,
          release_date: "1979-05-25",
        },
      ],
    });

    render(<Header initialTheme="light" />);

    fireEvent.click(screen.getByLabelText("Abrir busca"));
    fireEvent.change(screen.getByPlaceholderText("Buscar por título"), {
      target: { value: "Alien" },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(
      await screen.findByLabelText("Sem pôster para Alien"),
    ).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});
