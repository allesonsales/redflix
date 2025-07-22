import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalContext } from "../../contexts/providerContext";
import type { Video } from "../../interfaces";
import CommentSection from "../CommentSection/CommentSection";
import "./style.css";

function MoviePage() {
  const location = useLocation();
  const { movie } = location.state || {};
  const { genres } = useGlobalContext();
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [arrGenNames, setArrGenNames] = useState<string[]>([]);

  const [mute, setMute] = useState<boolean>(true);

  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    if (!movie?.id) return;

    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=pt-BR`
    )
      .then((res) => res.json())
      .then((videoData) => {
        const trailer = videoData.results.find(
          (video: Video) => video.site === "YouTube" && video.type === "Trailer"
        );
        setTrailerKey(trailer.key);
      });
  }, [movie]);

  const handleMute = () => {
    setMute((prev) => !prev);
  };

  const getGenresNames = (genresIds: number[]) => {
    return genresIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[];
  };

  const genresNames = movie?.genre_ids ? getGenresNames(movie.genre_ids) : [];

  useEffect(() => {
    if (movie?.genre_ids && genres.length > 0) {
      const names = movie.genre_ids
        .map((id: number) => genres.find((g) => g.id === id)?.name)
        .filter((name: string): name is string => !!name);
      setArrGenNames(names);
    }
  }, [movie?.genre_ids, genres]);

  return (
    <section>
      <section id="movie">
        <div className="movie-detail">
          <div className="video-container">
            {trailerKey ? (
              <>
                <button onClick={handleMute}>
                  <i
                    className={`bi ${
                      mute ? "bi-volume-mute-fill" : "bi-volume-up-fill"
                    } `}
                  ></i>
                </button>
                <iframe
                  width="150%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${
                    mute ? 1 : 0
                  }&loop=1&playlist=${trailerKey}&controls=0`}
                  title={movie.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="mediaCover"
                ></iframe>
              </>
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                alt={movie.title}
              />
            )}
          </div>
          <div className="description">
            <h1>{movie.title}</h1>
            <div className="stats">
              <p>
                <strong>Ano:</strong> {movie.release_date?.slice(0, 4)}
              </p>
              <p>
                <strong>Nota:</strong> {movie.vote_average}
              </p>
              <div className="genres-container">
                <p>
                  <strong>Gêneros:</strong>{" "}
                </p>
                <div className="genres">
                  {genresNames.map((genre) => (
                    <p key={genre} className="generos">
                      {genre}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <p className="overview">
              <strong>Descrição:</strong> {movie.overview}
            </p>
          </div>
        </div>
        <CommentSection movie={movie} genresNames={arrGenNames} />
      </section>
    </section>
  );
}

export default MoviePage;
