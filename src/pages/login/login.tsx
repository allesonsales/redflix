import { useContext, useState } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContexts";
import ModalNotification from "./modalNotification";

function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const endereco = import.meta.env.VITE_BASE_URL;

  if (!auth) {
    return null;
  }

  const { login } = auth;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`${endereco}/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        setModalMessage(data.message);
        setIsOpen(true);
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (error) {
      setModalMessage("erro ao logar" + error);
      setIsOpen(true);
    }
  }

  return (
    <section id="login">
      <div className="login-container">
        <h1>Entrar</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail..."
            />
          </div>
          <div className="form-control">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="password"
            >
              <i
                className={
                  showPassword ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
                }
              ></i>
            </button>
          </div>
          <input type="submit" value="Entrar" />
        </form>
        <Link to="/registre-se">
          <button className="create">Criar conta</button>
        </Link>
        <Link to="/recuperar" className="recuperar-senha">
          Esqueceu sua senha?
        </Link>
      </div>
      <ModalNotification
        isOpen={isOpen}
        modalMessage={modalMessage}
        onClose={() => {
          setIsOpen(false);
          if (auth.user) {
            navigate("/filmes");
          }
        }}
      />
    </section>
  );
}

export default Login;
