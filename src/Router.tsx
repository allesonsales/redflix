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
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

function RedRoutes() {
  return (
    <BrowserRouter basename="/redflix">
      <ErrorBoundary>
        <GlobalProvider>
          <AuthProvider>
            <Header />
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/registre-se"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/recuperar"
                element={
                  <PublicRoute>
                    <RecoverPassword />
                  </PublicRoute>
                }
              />
              <Route
                path="/configuracoes"
                element={
                  <PrivateRoute>
                    <Config />
                  </PrivateRoute>
                }
              />
              <Route
                path="/filmes"
                element={
                  <PrivateRoute>
                    <MovieList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/filmes/:id"
                element={
                  <PrivateRoute>
                    <MoviePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/filmes/minha-lista"
                element={
                  <PrivateRoute>
                    <MyMovieList />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </GlobalProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default RedRoutes;
