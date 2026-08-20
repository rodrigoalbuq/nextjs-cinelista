# 🎬 Cinelista

Catálogo de filmes feito com **Next.js 16**, **TypeScript** e **TMDB**.

## O que tem

- Listas de filmes em destaque, populares, em alta e top rated
- Busca por título com campo expansível, sugestões automáticas e navegação por teclado
- Detalhe do filme com avaliação por estrelas salva no navegador
- Fallback visual para pôster e sinopse ausentes
- Interface responsiva com tema claro/escuro

## Como rodar

```bash
npm install
npm run dev
```

Se quiser usar a API do TMDB, crie um `.env.local` com:

```bash
TMDB_API_URL=https://api.themoviedb.org/3/
TMDB_API_KEY=sua_chave_da_api_aqui
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run test:once
```

## Testes validados

- `Header.test.tsx`
- `Card.test.tsx`
- `src/app/filmes/[id]/page.test.tsx`

## Estrutura resumida

- `src/app/components/Header` - busca e tema
- `src/app/components/Card` - card com fallback de pôster
- `src/app/filmes/[id]` - detalhe, fallback e avaliação
- `src/app/filmes/busca` - resultados da busca
- `src/lib/api/tmdb.ts` - integrações com a TMDB

## Licença

MIT

---

**Feito para amantes de cinema** 🍿
