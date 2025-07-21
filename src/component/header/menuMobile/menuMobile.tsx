import { Link } from "react-router-dom";
import type { MenuProps } from "../../../interfaces";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./style.css";

function MenuMobile({
  genres,
  setSelectedGenre,
  navigate,
  searched,
  setSearched,
  setShowCategory,
  showCategory,
  user,
  logout,
}: MenuProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      <div className="mobile">
        <div className="left-container">
          <Link to="/">
            <img src="/logo.png" alt="Readflix" />
          </Link>
        </div>

        <div className="center-container">
          <input
            type="text"
            name="search"
            placeholder="Filmes, títulos e gêneros..."
            onChange={(e) => {
              setSearched?.(e.target.value);
            }}
            value={searched}
          />
        </div>

        <div className="right-container">
          <div
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <i className="bi bi-x"></i>
            ) : (
              <i className="bi bi-list"></i>
            )}
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                className="menu-mobile-open"
                initial={{ x: 250 }}
                animate={{ x: 0 }}
                exit={{ x: 250 }}
                transition={{ duration: 0.5 }}
              >
                <div className="user-stats">
                  <p>Olá, {user?.userName}</p>
                  {user?.photo ? (
                    <img src={user?.photo} alt={user?.userName} />
                  ) : (
                    <i className="bi bi-person-circle"></i>
                  )}
                </div>
                <ul>
                  <li>
                    <Link
                      to="/filmes"
                      onClick={() => {
                        setSearched?.("");
                        setMenuOpen(false);
                      }}
                    >
                      Filmes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/filmes/minha-lista"
                      onClick={() => {
                        setMenuOpen(false);
                      }}
                    >
                      Minha lista
                    </Link>
                  </li>
                  <li>
                    <div className="category">
                      <button
                        className="category-button"
                        onClick={() => setShowCategory?.((prev) => !prev)}
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
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: showCategory ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            {genres?.map((genres) => (
                              <li
                                key={genres.id}
                                onClick={() => {
                                  setSelectedGenre?.(genres.id);
                                  navigate?.("/filmes#lista");
                                  setSearched?.("");
                                  setShowCategory?.(false);
                                  setMenuOpen(false);
                                }}
                              >
                                <p>{genres.name}</p>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </li>
                  <li></li>
                </ul>
                <div className="logout">
                  <button>
                    <Link
                      to={"/configuracoes"}
                      onClick={() => setMenuOpen(false)}
                    >
                      <i className="bi bi-gear-fill"></i>
                    </Link>
                  </button>
                  <button onClick={logout}>Sair</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default MenuMobile;
