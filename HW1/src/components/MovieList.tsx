import type { Movie } from '../types/Movie';
import { MovieCard } from './MovieCard';

type Props = {
  movies: Movie[];
  toggleFavorite: (id: number) => void;
  viewMode: 'grid' | 'list';
};

export function MovieList({ movies, toggleFavorite, viewMode }: Props) {
  if (movies.length === 0) {
    return <p>Фильмов нет</p>;
  }

  return (
    <div className={`movie-list ${viewMode}`}>
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} toggleFavorite={toggleFavorite} viewMode={viewMode} />
      ))}
    </div>
  );
}
