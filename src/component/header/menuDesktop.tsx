import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { MenuProps } from "../../interfaces";

function MenuDesktop({
  searched,
  setSearched,
  setShowCategory,
  showCategory,
  setSelectedGenre,
  setSearching,
  searching,
  genres,
  user,
  logout,
  navigate,
}: MenuProps) {
  return (
    <>
      <div className="left-container">
        <Link to="/">
          <img src="/logo.png" alt="Readflix" />
        </Link>
        <div className="action-container">
          <Link
            to="/filmes"
            onClick={() => {
              setSearched?.("");
              setShowCategory?.(false);
            }}
          >
            Filmes
          </Link>
          <Link
            to="/filmes/minha-lista"
            onClick={() => {
              setShowCategory?.(false);
            }}
          >
            Minha Lista
          </Link>
          <div className="category">
            <button
              className="category-button"
              onClick={() => {
                setShowCategory?.((prev) => !prev);
              }}
            >
              Categorias
              <motion.i
                className="bi bi-chevron-down"
                animate={{ rotate: showCategory ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              ></motion.i>
            </button>
            <AnimatePresence>
              {showCategory && (
                <motion.ul
                  className="category-container"
                  initial={{ scaleY: 0, y: -300 }}
                  animate={{ scaleY: 1, y: 0 }}
                  exit={{ scaleY: 0, y: -300 }}
                  transition={{ duration: 0.2 }}
                >
                  {genres?.map((genres) => (
                    <li
                      key={genres.id}
                      onClick={() => {
                        setSelectedGenre?.(genres.id);
                        navigate?.("/filmes#lista");
                        setSearched?.("");
                        setShowCategory?.(false);
                      }}
                    >
                      <p>{genres.name}</p>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="action-container user">
        <AnimatePresence>
          {searching && (
            <motion.input
              initial={{ scaleX: 0 }}
              animate={{ scaleX: searching ? 1 : 0 }}
              exit={{ scaleX: 0 }}
              type="text"
              name="search"
              placeholder="Filmes, títulos e gêneros..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearched?.(e.target.value);
              }}
              value={searched ?? ""}
            />
          )}
        </AnimatePresence>
        <button
          onClick={() => {
            if (!searching) {
              setSearching?.(true);
            } else {
              if ((searched ?? "").trim() === "") {
                setSearching?.(false);
              } else {
                setSelectedGenre?.(null);
                setSearching?.(false);
                setShowCategory?.(false);
                navigate?.("/filmes#lista");
              }
            }
          }}
        >
          <i className="bi bi-search"></i>
        </button>
        <div className="user-stats">
          <p>Olá, {user?.userName}</p>
          {user?.photo ? (
            <img src={user?.photo} alt={user?.userName} />
          ) : (
            <i className="bi bi-person-circle"></i>
          )}
        </div>
        <button>
          <Link
            to={"/configuracoes"}
            onClick={() => {
              setShowCategory?.(false);
            }}
          >
            <i className="bi bi-gear-fill"></i>
          </Link>
        </button>
        <button onClick={logout}>Sair</button>
      </div>
    </>
  );
}

export default MenuDesktop;
