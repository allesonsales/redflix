export type MenuProps = {
  searched?: string;
  setSearched?: (value: string) => void;
  setGenres?: (genres: Genre[]) => void;
  setShowCategory?: React.Dispatch<React.SetStateAction<boolean>>;
  showCategory?: boolean;
  setSelectedGenre?: (id: number | null) => void;
  setSearching?: (value: boolean) => void;
  searching?: boolean;
  genres?: Genre[];
  user?: User;
  logout?: () => void;
  navigate?: (path: string) => void;
};

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genre_names?: string[];
  overview: string;
  poster_path: string;
  movieId: number;
}

export interface MovieList extends Movie {
  id: number;
  userId: number;
  movieId: number;
  watched: boolean;
  toWatch: boolean;
  createdAt: string;
  updatedAt: string;
  movie: Movie;
}

export interface Comment {
  id: number;
  username: string;
  userId: number;
  likes: number;
  dislikes: number;
  title: string;
  comment: string;
  User?: {
    id: number;
    username: string;
    photo: string;
  };
}

export interface MovieForComment {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  genres_names: string[];
  poster_path: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface modalMessageProps {
  modalMessage: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface modalConfigsProps {
  isOpen: string | null;
  onClose: () => void;
}

export interface modalDeleteProps {
  isOpen: string | null;
  onClose: () => void;
  user: User | null;
}

export interface photoProps {
  photo: string;
  onPhotoChange: React.Dispatch<React.SetStateAction<string>>;
  onPreviewChange: React.Dispatch<React.SetStateAction<string>>;
  onFileChange: React.Dispatch<React.SetStateAction<File | null>>;
}

export interface User {
  id: number;
  name: string;
  userName: string;
  email: string;
  movieList: Movie[];
  photo?: string;
  createdAt: string;
}

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
};

export type MovieCardProps = {
  movie: Movie;
  activeMovieId: number | null;
  myMovieList: Movie[] | null;
  setMyMovieList: React.Dispatch<React.SetStateAction<MovieList[] | null>>;
  setModalMessage?: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveMovie: (id: number | null) => void;
  ratingMovie: (rating: number) => number;
  genresNames: string[];
};
