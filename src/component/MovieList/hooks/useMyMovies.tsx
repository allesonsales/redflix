import { useEffect, useState } from "react";
import { type Movie, type MovieList } from "../../../interfaces";

export default function useMyMovies() {
  const [myMovies, setMyMovies] = useState<MovieList[] | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:3000/movies/get-movie`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMyMovies(data);
      })
      .catch(console.error);
  }, []);

  const toggleMovie = async (movie: Movie, genresNames: string[]) => {
    try {
      const res = await fetch(`http://localhost:3000/movies/add-movie`, {
        method: `POST`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": `application/json`,
        },
        body: JSON.stringify({ movie, genresNames }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedMmovies = await fetch(
          `http://localhost:3000/movies/get-movie`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        ).then((res) => res.json());

        setMyMovies(updatedMmovies);
      } else {
        setModalMessage(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { myMovies, setMyMovies, toggleMovie, modalMessage };
}
