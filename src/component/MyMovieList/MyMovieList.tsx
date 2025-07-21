import { useEffect, useState } from "react";
import useMyMovies from "../MovieList/hooks/useMyMovies";
import { Link } from "react-router-dom";
import "./style.css";

function MyMovieList() {
  const [activeMovie, setActiveMovie] = useState<number | null>(null);

  const ratingMovie = (rating: number): number => {
    return Math.round(rating / 2);
  };

  const { myMovies: myMovieList, toggleMovie } = useMyMovies();

  useEffect(() => {
    console.log(myMovieList);
  }, [myMovieList]);

  return (
    <>
      <section id="my-list">
        <h2>Minha lista</h2>
        <div className="movies-container">
          {myMovieList && myMovieList.length > 0 ? (
            <ul>
              {myMovieList.map((item) => {
                const { movie } = item;
                const { title, poster_path, id, genre_names, vote_average } =
                  movie;
                const genreNames: string[] = genre_names ?? [];
                const year = movie.release_date
                  ? movie.release_date.slice(0, 4)
                  : "N/A";
                const poster = poster_path
                  ? `https://image.tmdb.org/t/p/w500${poster_path}`
                  : "";
                const matchMovie = myMovieList.some(
                  (fav) => fav.movieId === id
                );

                return (
                  <li
                    className={activeMovie === id ? "active" : ""}
                    key={id}
                    onMouseEnter={() => setActiveMovie(id)}
                    onMouseLeave={() => setActiveMovie(null)}
                  >
                    <Link to={`/filmes/${id}`} state={{ movie }}>
                      <img src={poster} alt={title} />
                      {activeMovie === id && (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleMovie(movie, genreNames as string[]);
                            }}
                          >
                            <i
                              className={`bi ${
                                matchMovie
                                  ? "bi-dash-circle-fill"
                                  : "bi-plus-circle"
                              }`}
                            ></i>
                          </button>
                          <div className="description">
                            <div className="row">
                              <h3>{title}</h3>
                              <div className="rating">
                                {Array.from({
                                  length: ratingMovie(vote_average),
                                }).map((_, i) => (
                                  <i className="bi bi-star-fill" key={i}></i>
                                ))}
                              </div>
                            </div>
                            <div className="row">
                              <div className="genres">
                                {genreNames.map((genre: string) => (
                                  <p key={genre} className="generos">
                                    {genre}
                                  </p>
                                ))}
                              </div>
                              <p className="year">{year}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <h2 className="empty-list">Sua lista de filmes está vazia :(</h2>
          )}
        </div>
      </section>
    </>
  );
}

export default MyMovieList;
