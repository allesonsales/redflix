import { useEffect, useState } from "react";
import { type Movie } from "../../../interfaces";
import { useGlobalContext } from "../../../contexts/providerContext";

function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { selectedGenre, searched } = useGlobalContext();
  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    setPage(1);
    setMovies([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedGenre, searched]);

  useEffect(() => {
    setLoading(true);
    const handleScroll = () => {
      const endPage =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (endPage) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    const endpoint =
      searched.trim() !== ""
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(
            searched
          )}&page=${page}`
        : selectedGenre
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&language=pt-BR&page=${page}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setMovies((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [API_KEY, page, selectedGenre, searched]);

  return { movies, loading };
}

export default useMovies;
