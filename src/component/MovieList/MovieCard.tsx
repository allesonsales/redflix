import { Link } from "react-router-dom";
import type { Movie, MovieCardProps } from "../../interfaces";
import "./style.css";

function MovieCard({
  movie,
  activeMovieId,
  setActiveMovie,
  ratingMovie,
  genresNames,
  myMovieList,
  setIsOpen,
  setModalMessage,
  setMyMovieList,
}: MovieCardProps) {
  const { id, title, release_date, vote_average, poster_path } = movie;

  const matchMovie = myMovieList?.some((fav: Movie) => fav.id === id);

  const year = release_date ? release_date.slice(0, 4) : "N/A";
  const poster = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "";

  const toggleList = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/movies/add-movie", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie, genresNames }),
      });

      const data = await res.json();
      if (res.ok) {
        const updatedMovies = await fetch(
          "http://localhost:3000/movies/get-movie",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ).then((res) => res.json());

        setMyMovieList?.(updatedMovies);
      } else {
        setModalMessage?.(data.message);
        setIsOpen?.(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <li
        onMouseEnter={() => setActiveMovie(id)}
        onMouseLeave={() => setActiveMovie(null)}
        className={activeMovieId === id ? "active" : ""}
      >
        <Link to={`/filmes/${id}`} state={{ movie }}>
          <img src={poster} alt={title} />
          {activeMovieId === id && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleList();
                }}
              >
                <i
                  className={`bi ${
                    matchMovie ? "bi-dash-circle-fill" : "bi-plus-circle"
                  }`}
                ></i>
              </button>
              <div className="description">
                <div className="row">
                  <h3>{title}</h3>
                  <div className="rating">
                    {Array.from({ length: ratingMovie(vote_average) }).map(
                      (_, i) => (
                        <i className="bi bi-star-fill" key={i}></i>
                      )
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="genres">
                    {genresNames.map((genre) => (
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
    </>
  );
}

export default MovieCard;
