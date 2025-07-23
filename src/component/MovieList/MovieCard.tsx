import { Link } from "react-router-dom";
import type { MovieCardProps } from "../../interfaces";
import "./style.css";
import { useGlobalContext } from "../../contexts/providerContext";

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

  const { isMobile } = useGlobalContext();

  const endereco = import.meta.env.VITE_BASE_URL;

  const matchMovie = myMovieList?.some(
    (fav) => Number(fav.movieId) === Number(id)
  );

  const year = release_date ? release_date.slice(0, 4) : "N/A";
  const poster = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "";

  const toggleList = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${endereco}/movies/add-movie`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie, genresNames }),
      });

      const data = await res.json();
      if (res.ok) {
        const updatedMovies = await fetch(`${endereco}/movies/get-movie`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json());

        setMyMovieList?.([...updatedMovies]);
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
        <Link to={`/redflix/filmes/${id}`} state={{ movie }}>
          <img src={poster} alt={title} />
          {isMobile && (
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
          )}
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
                  aria-label="Adicionar ou remover filme da minha lista de favoritos"
                  className={`bi ${
                    matchMovie ? "bi-dash-circle-fill" : "bi-plus-circle"
                  }`}
                ></i>
              </button>

              <div className="description">
                <div className="row">
                  <h3 className="title-movie">{title}</h3>
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
