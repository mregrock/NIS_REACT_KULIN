import axios from 'axios'
import type { KpResponse } from '../types/movie'
import { MOCK_MOVIES } from '../data/mockMovies'

const API_KEY = import.meta.env.VITE_KP_KEY || ''

const api = axios.create({
  baseURL: 'https://api.poiskkino.dev',
  timeout: 6000,
  headers: {
    'X-API-KEY': API_KEY,
  },
})

export const GENRE_LIST = [
  'драма', 'комедия', 'боевик', 'триллер', 'фантастика',
  'мелодрама', 'ужасы', 'криминал', 'приключения', 'анимация',
  'история', 'биография', 'детектив', 'фэнтези', 'документальный',
]

export const fetchMovies = async (
  page = 1,
  genre?: string,
  preferredGenres: string[] = []
): Promise<KpResponse> => {
  try {
    const params: Record<string, string | number> = {
      limit: 10,
      page,
      notNullFields: 'poster.url',
      type: 'movie',
      'votes.imdb': '10000-99999999',
      'movieLength': '60-300',
      sortField: 'votes.imdb',
      sortType: -1,
    }

    if (genre) {
      params['genres.name'] = genre
    } else if (preferredGenres.length > 0) {
      params['genres.name'] = preferredGenres[0]
    }

    const response = await api.get<KpResponse>('/v1.4/movie', { params })
    return response.data
  } catch {
    const filtered = genre
      ? MOCK_MOVIES.filter((m) => m.genres.some((g) => g.name === genre))
      : MOCK_MOVIES
    const pageSize = 10
    const start = (page - 1) * pageSize
    return {
      docs: filtered.slice(start, start + pageSize),
      total: filtered.length,
      limit: pageSize,
      page,
      pages: Math.ceil(filtered.length / pageSize),
    }
  }
}
