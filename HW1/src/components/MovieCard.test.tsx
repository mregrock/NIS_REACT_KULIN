import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MovieCard } from './MovieCard';

const movie = {
  id: 7,
  title: 'Тестовый фильм',
  year: 2020,
  posterUrl: 'https://example.com/poster.jpg',
  isFavorite: false,
};

describe('MovieCard', () => {
  it('renders title and year', () => {
    render(
      <MovieCard movie={movie} toggleFavorite={vi.fn()} viewMode="list" />,
    );
    expect(
      screen.getByRole('heading', { name: movie.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(String(movie.year))).toBeInTheDocument();
  });

  it('calls toggleFavorite with movie id', async () => {
    const user = userEvent.setup();
    const toggleFavorite = vi.fn();
    const { getByRole } = render(
      <MovieCard
        movie={movie}
        toggleFavorite={toggleFavorite}
        viewMode="list"
      />,
    );
    await user.click(getByRole('button', { name: '★' }));
    expect(toggleFavorite).toHaveBeenCalledWith(movie.id);
  });
});
