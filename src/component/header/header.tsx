import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContexts";
import { useGlobalContext } from "../../contexts/providerContext";
import MenuMobile from "./menuMobile/menuMobile";
import MenuDesktop from "./menuDesktop";

function Header() {
  const [searching, setSearching] = useState<boolean>(false);
  const [showCategory, setShowCategory] = useState<boolean>(false);
  const { genres, setSelectedGenre, setSearched, searched, isMobile } =
    useGlobalContext();

  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { user, logout } = auth;

  return (
    <header>
      {user ? (
        <>
          {isMobile ? (
            <MenuMobile
              genres={genres}
              setSelectedGenre={setSelectedGenre}
              searched={searched}
              setSearched={setSearched}
              setShowCategory={setShowCategory}
              showCategory={showCategory}
              navigate={navigate}
              user={user}
              logout={logout}
            />
          ) : (
            <MenuDesktop
              genres={genres}
              setSelectedGenre={setSelectedGenre}
              searched={searched}
              setSearched={setSearched}
              navigate={navigate}
              searching={searching}
              setSearching={setSearching}
              showCategory={showCategory}
              setShowCategory={setShowCategory}
              logout={logout}
              user={user}
            />
          )}
        </>
      ) : (
        <>
          <div className="left-container">
            <Link to="/">
              <img src="/logo.png" alt="Readflix" />
            </Link>

            <Link to="/">Entrar</Link>
            <Link to="/registre-se">Registre-se</Link>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
