import { useEffect, useState } from "react";
import Highlight from "./highlight/highlight";
import MovieCard from "./MovieCard";
import { useGlobalContext } from "../../contexts/providerContext";
import "./style.css";
import useMovies from "./hooks/useMovies";
import useMyMovies from "./hooks/useMyMovies";
import { useLocation } from "react-router-dom";

function MovieList() {
  const [activeMovie, setActiveMovie] = useState<number | null>(null);
  const { movies: moviesList, loading } = useMovies();
  const { genres, selectedGenre, searched } = useGlobalContext();
  const { myMovies: myMovieList, setMyMovies: setMyMovieList } = useMyMovies();

  const getGenresNames = (genresIds?: number[]) => {
    if (!genres.length || !genresIds || genresIds.length === 0) return [];
    return genresIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[];
  };

  const selectedGenreName = genres.find((g) => g.id === selectedGenre)?.name;

  const ratingMovie = (rating: number): number => {
    return Math.round(rating / 2);
  };

  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <section>
        <Highlight />
        <div className="movies-container" id="lista">
          <div className="genre-name">
            {selectedGenreName && <h2>{selectedGenreName}</h2>}
            {searched && <h2>{searched}</h2>}
            {}
          </div>
          <ul>
            {moviesList?.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                activeMovieId={activeMovie}
                setActiveMovie={setActiveMovie}
                genresNames={getGenresNames(movie.genre_ids)}
                myMovieList={myMovieList}
                setMyMovieList={setMyMovieList}
                ratingMovie={ratingMovie}
              />
            ))}
          </ul>
          {loading && <div className="loading-spinner"></div>}
        </div>
      </section>
    </>
  );
}

export default MovieList;
