import { Filme } from "@/types/types";
import tmdbApi from "./axios";



type Data = {
    results: Filme[]
}

export const getTrendindMovies = async () => {
    // Função para buscar filmes em destaque na API do TMDB
    const res = await tmdbApi.get<Data>("trending/movie/week?language=pt-BR")
    return res.data.results;

};

export const getMovieDetails = async (id: number): Promise<Filme | undefined> => {

    const res = await tmdbApi.get<Filme>(`/movie/${id}?language=pt-BR`)
    return res.data;

};

export const getNowPlaying = async () => {
    // Função para buscar filmes sendo reproduzidos na API do TMDB
    const res = await tmdbApi.get<Data>("/movie/now_playing?language=pt-BR")
    return res.data.results;

};

export const getPopularMovies = async () => {
    // Função para buscar os filmes mais populares na API do TMDB
    const res = await tmdbApi.get<Data>("/movie/popular?language=pt-BR")
    return res.data.results;

};

export const getTopMovies = async () => {
    // Função para buscar os filmes mais bem avaliados na API do TMDB
    const res = await tmdbApi.get<Data>("/movie/top_rated?language=pt-BR")
    return res.data.results;

};



