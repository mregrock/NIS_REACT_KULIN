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
    <div className="app-container">
      <h1>Каталог фильмов</h1>
      
      <header className="controls-header">
        <div className="search-bar">
          <input type="text" ref={searchRef} onChange={handleSearch} placeholder="Поиск по названию..." />
        </div>
        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Все</button>
          <button onClick={() => setFilter('favorites')} className={filter === 'favorites' ? 'active' : ''}>Только избранные</button>
        </div>
        <div className="view-mode-buttons">
          <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>Плитка</button>
          <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}>Список</button>
        </div>
      </header>

      <MovieList movies={filteredMovies} toggleFavorite={toggleFavorite} viewMode={viewMode} />
    </div>
  )
}

export default App
