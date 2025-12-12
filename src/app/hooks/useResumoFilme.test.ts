import { renderHook } from "@testing-library/react";
import { useResumoFilme } from "./useResumoFilme";

test("Retorna overview inteiro se menor que limite", () => {
  const texto = "Este é um resumo curto.";
  const { result } = renderHook(() => useResumoFilme(texto, 250));
  expect(result.current).toBe(texto);
});

test("Retorna overview cortado e reticências se passar do limite", () => {
  const texto =
    "Este é um resumo muito longo que deve ser cortado porque excede o limite de caracteres definido para o resumo do filme.";
  const { result } = renderHook(() => useResumoFilme(texto, 10));
  expect(result.current).toBe("Este é um ...");
});
