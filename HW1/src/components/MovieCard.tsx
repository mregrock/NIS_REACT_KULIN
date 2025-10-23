import type { Movie } from '../types/Movie';

type Props = {
  movie: Movie;
  toggleFavorite: (id: number) => void;
  viewMode: 'grid' | 'list';
};

export function MovieCard({ movie, toggleFavorite, viewMode }: Props) {
  return (
    <div className="movie-card">
      {viewMode === 'grid' && (
        <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%' }} />
      )}
      <div className="movie-card-info">
        <h2>{movie.title}</h2>
        <p>{movie.year}</p>
        <button onClick={() => toggleFavorite(movie.id)}>
          {movie.isFavorite ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
}
