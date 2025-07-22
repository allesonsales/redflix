import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Genre } from "../interfaces";

type GlobalContextType = {
  genres: Genre[];
  selectedGenre: number | null;
  setSelectedGenre: React.Dispatch<React.SetStateAction<number | null>>;
  searched: string;
  setSearched: React.Dispatch<React.SetStateAction<string>>;
  isMobile: boolean;
};

const GlobalContext = createContext<GlobalContextType>({
  genres: [],
  selectedGenre: null,
  searched: "",
  setSearched: () => {},
  setSelectedGenre: () => {},
  isMobile: false,
});

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searched, setSearched] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
    )
      .then((res) => res.json())
      .then((data) => setGenres(data.genres));
  }, [API_KEY]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        genres,
        selectedGenre,
        setSelectedGenre,
        searched,
        setSearched,
        isMobile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGlobalContext() {
  return useContext(GlobalContext);
}
