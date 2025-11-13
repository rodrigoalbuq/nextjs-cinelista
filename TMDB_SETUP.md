# Como configurar a API do TMDB

## Passos para configurar:

1. **Criar conta no TMDB:**
   - Acesse: https://www.themoviedb.org/
   - Crie uma conta gratuita

2. **Gerar API Key:**
   - Vá em Settings > API
   - Solicite uma API Key (v3 auth)
   - Copie sua chave da API

3. **Configurar no projeto:**
   - Abra o arquivo `.env.local` na raiz do projeto
   - Substitua `your_tmdb_api_key_here` pela sua chave real:
   ```
   TMDB_API_KEY=sua_chave_da_api_aqui
   ```

4. **Reiniciar o servidor:**
   ```bash
   npm run dev
   ```

## Observações:
- Sem a chave da API, a aplicação funcionará com dados mockados
- A aplicação não quebrará se a API não estiver configurada
- Os dados da API aparecerão assim que a chave for configurada corretamente