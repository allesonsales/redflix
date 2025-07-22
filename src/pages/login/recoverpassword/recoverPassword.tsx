import { useContext, useState } from "react";
import ModalNotification from "../modalNotification";
import { AuthContext } from "../../../contexts/AuthContexts";

function RecoverPassword() {
  const [userExist, setUserExist] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const auth = useContext(AuthContext);
  const endereco = import.meta.env.VITE_BASE_URL;

  if (!auth) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${endereco}/auth/verificar-email`, {
        method: "POST",
        headers: { "Content-type": "application/JSON" },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setUserName(data.userName);
        setUserExist(true);
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (error) {
      setModalMessage("Erro: " + error);
      setIsOpen(true);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${endereco}/auth/recuperar-senha`, {
        method: "POST",
        headers: { "Content-type": "application/JSON" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setModalMessage(data.message);
        setIsOpen(true);
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (err) {
      setModalMessage("Erro: " + err);
      setIsOpen(true);
    }
  };

  return (
    <section id="login">
      <div className="login-container">
        <h1>Recuperar senha</h1>
        {!userExist ? (
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
            <input type="submit" value="Buscar usuário" />
          </form>
        ) : (
          <>
            <p>Olá {userName}, Digite sua nova senha:</p>
            <form action="" onSubmit={handleChangePassword}>
              <div className="form-control">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                />
                <button
                  className="password"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <i
                    className={
                      showPassword ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
                    }
                  ></i>
                </button>
              </div>
              <input type="submit" value="Alterar senha" />
            </form>
          </>
        )}
      </div>
      <ModalNotification
        modalMessage={modalMessage}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </section>
  );
}

export default RecoverPassword;
