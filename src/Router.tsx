import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/login/register/register";
import Header from "./component/header/header";
import RecoverPassword from "./pages/login/recoverpassword/recoverPassword";

import ErrorBoundary from "./errorBoundary";
import { GlobalProvider } from "./contexts/providerContext";
import { AuthProvider } from "./contexts/AuthContexts";
import MovieList from "./component/MovieList/MovieList";
import MoviePage from "./component/Movie/Movie";
import MyMovieList from "./component/MyMovieList/MyMovieList";
import Config from "./pages/login/configs/config";

function RedRoutes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <GlobalProvider>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/redflix" element={<Login />} />
              <Route path="/redflix/registre-se" element={<Register />} />
              <Route path="/redflix/recuperar" element={<RecoverPassword />} />
              <Route path="/redflix/configuracoes" element={<Config />} />
              <Route path="/redflix/filmes" element={<MovieList />} />
              <Route path="/reflix/filmes/:id" element={<MoviePage />} />
              <Route
                path="/redflix/filmes/minha-lista"
                element={<MyMovieList />}
              />
            </Routes>
          </AuthProvider>
        </GlobalProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default RedRoutes;
