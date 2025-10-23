import type { Movie } from '../types/Movie';

export const movies: Movie[] = [
  {
    id: 1,
    title: 'Таксист',
    posterUrl: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7133a647-0537-4c58-9048-f5d3876dec08/orig',
    year: 1976,
    isFavorite: false,
  },
  {
    id: 2,
    title: 'Славные парни',
    posterUrl: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/3ff8f49a-bb5d-40c3-8e8d-70732aae69ab/orig',
    year: 1990,
    isFavorite: true,
  },
  {
    id: 3,
    title: 'Казино',
    posterUrl: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/6ef63d9f-0a56-4e1f-89d2-9e96a30c4d5d/orig',
    year: 1995,
    isFavorite: false,
  },
  {
    id: 4,
    title: 'Ирландец',
    posterUrl: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/bdeaa0c2-fe6a-4007-a47b-1d9f9d9547d3/orig',
    year: 2019,
    isFavorite: false,
  }
];
