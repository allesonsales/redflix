import { useContext, useEffect, useState } from "react";
import type { modalConfigsProps } from "../../../../interfaces";
import { AnimatePresence, motion } from "framer-motion";
import "./style.css";
import { AuthContext } from "../../../../contexts/AuthContexts";
import ModalNotification from "../../modalNotification";

function ModalPassword({ isOpen, onClose }: modalConfigsProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [actualPassword, setActualPassword] = useState<string>("");
  const [newPassword, SetNewPassword] = useState<string>("");
  const [confirmNewPassword, SetConfirmNewPassword] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { user } = auth;
  const endereco = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword != confirmNewPassword) {
      setModalMessage(
        `A nova senha e a senha de confirmação estão diferentes, tente novamente!`
      );
      setNotificationOpen(true);
      return;
    }

    await fetch(`${endereco}/auth/trocar-senha`, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: user?.id, actualPassword, newPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        setModalMessage(data.message);
        setNotificationOpen(true);

        if (auth?.login && auth?.token) {
          auth.login(auth.token, data.user);
        }
      })
      .catch((err) => {
        console.error(err);
        setModalMessage("Erro ao atualizar a senha. Tente novamente.");
        setNotificationOpen(true);
      });
  };

  useEffect(() => {
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen === "password" && (
          <div className="modal-background">
            <motion.div
              className="modal"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <i className="bi bi-x-circle" onClick={onClose}></i>
              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <p>Digite sua senha:</p>
                  <input
                    type="text"
                    name="password"
                    placeholder="Senha atual..."
                    onChange={(e) => setActualPassword(e.target.value)}
                    value={actualPassword}
                  />
                </div>
                <div className="form-control">
                  <p>Digite a nova senha:</p>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Nova senha..."
                    onChange={(e) => SetNewPassword(e.target.value)}
                    value={newPassword}
                  />
                  <button
                    className="password"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <i
                      className={
                        showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
                      }
                    ></i>
                  </button>
                </div>
                <div className="form-control">
                  <p>Confirme a senha:</p>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    placeholder="Confirme a nova senha..."
                    onChange={(e) => SetConfirmNewPassword(e.target.value)}
                    value={confirmNewPassword}
                  />
                  <button
                    className="password"
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <i
                      className={
                        showConfirmPassword
                          ? "bi bi-eye-slash-fill"
                          : "bi bi-eye-fill"
                      }
                    ></i>
                  </button>
                </div>
                <div className="button-container">
                  <button type="submit">
                    <p>Alterar senha</p>
                  </button>
                  <button type="button" onClick={onClose}>
                    <p>Cancelar</p>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ModalNotification
        isOpen={notificationOpen}
        modalMessage={modalMessage}
        onClose={() => setNotificationOpen(false)}
      />
    </>
  );
}

export default ModalPassword;
