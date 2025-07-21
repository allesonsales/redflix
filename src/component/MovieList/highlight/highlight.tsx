import { useEffect, useState } from "react";
import type { Movie, Video } from "../../../interfaces";
import "./style.css";
import { useGlobalContext } from "../../../contexts/providerContext";

function Highlight() {
  const [movieHighLight, setMovieHighLight] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [mute, setMute] = useState<boolean>(true);
  const { selectedGenre } = useGlobalContext();

  const handleMute = () => {
    setMute((prev) => !prev);
  };

  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    const endpoint = selectedGenre
      ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&language=pt-BR&page=1`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const random = Math.floor(Math.random() * data.results.length);
        const selected = data.results[random];
        setMovieHighLight(selected);

        return fetch(
          `https://api.themoviedb.org/3/movie/${selected.id}/videos?api_key=${API_KEY}&language=pt-BR`
        );
      })
      .then((res) => res.json())
      .then((videoData) => {
        const trailer = videoData.results.find(
          (video: Video) => video.site === "YouTube" && video.type === "Trailer"
        );
        setTrailerKey(trailer?.key);
      });
  }, [API_KEY, selectedGenre]);

  return (
    <>
      {movieHighLight && (
        <section id="highlight">
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
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${
                    mute ? 1 : 0
                  }&loop=1&playlist=${trailerKey}&controls=0`}
                  title={movieHighLight.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="mediaCover"
                ></iframe>
              </>
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/w780${movieHighLight.poster_path}`}
                alt={movieHighLight.title}
              />
            )}
          </div>
          <div className="description">
            <h2>{movieHighLight.title}</h2>
            <p>{movieHighLight.overview}</p>
          </div>
        </section>
      )}
    </>
  );
}

export default Highlight;
