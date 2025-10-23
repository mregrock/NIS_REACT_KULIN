import { useState, useRef } from 'react';
import { movies as initialMovies } from './data/movies';
import { MovieList } from './components/MovieList';
import type { Movie } from './types/Movie';
import './App.css';

type FilterType = 'all' | 'favorites';
type ViewMode = 'grid' | 'list';

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleFavorite = (id: number) => {
    setMovies(movies.map(movie => 
      movie.id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie
    ));
  };

  const handleSearch = () => {
    setMovies([...movies]);
  }

  const filteredMovies = movies
    .filter(movie => filter === 'all' || movie.isFavorite)
    .filter(movie => {
      const query = searchRef.current?.value.toLowerCase() || '';
      return movie.title.toLowerCase().includes(query);
    });

  return (
    <>
      <h1>Каталог фильмов</h1>
      <div>
        <input type="text" ref={searchRef} onChange={handleSearch} placeholder="Поиск по названию..." />
      </div>
      <div>
        <button onClick={() => setFilter('all')}>Все</button>
        <button onClick={() => setFilter('favorites')}>Избранные</button>
      </div>
      <div>
        <button onClick={() => setViewMode('grid')}>Плитка</button>
        <button onClick={() => setViewMode('list')}>Список</button>
      </div>
      <MovieList movies={filteredMovies} toggleFavorite={toggleFavorite} viewMode={viewMode} />
    </>
  )
}

export default App
