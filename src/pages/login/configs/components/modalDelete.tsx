import { useContext, useEffect, useState } from "react";
import type { modalDeleteProps } from "../../../../interfaces";
import { AuthContext } from "../../../../contexts/AuthContexts";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ModalDelete({ isOpen, onClose, user }: modalDeleteProps) {
  const auth = useContext(AuthContext);
  const [deletedAccount, setDeletedAccount] = useState<boolean>(false);
  const [deletedMessage, setDeletedMessage] = useState<string>("");
  const navigate = useNavigate();
  const endereco = import.meta.env.VITE_BASE_URL;
  if (!auth) return null;

  const { logout } = auth;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (deletedAccount) {
      const timer = setTimeout(() => {
        logout();
        navigate("/");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [deletedAccount, logout]);

  const deleteAccount = async () => {
    try {
      const res = await fetch(`${endereco}/auth/delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      const data = await res.json();
      setDeletedMessage(data.message);
      setDeletedAccount(true);
    } catch (err) {
      console.error(err);
      setDeletedMessage("Erro ao excluir a conta.");
      setDeletedAccount(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen === "delete" && !deletedAccount && (
          <motion.div
            className="modal-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal delete"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <i className="bi bi-x-circle" onClick={onClose}></i>
              <img src="/redflix/delete.svg" alt="Deletar conta" />
              <span>
                Sentimos muito que queira ir embora{" "}
                <strong>{user?.name}</strong>. Tem certeza que deseja excluir
                sua conta?
              </span>
              <div className="button-container">
                <button onClick={deleteAccount}>
                  <p>Sim</p>
                </button>
                <button className="cancel" onClick={onClose}>
                  <p>Cancelar</p>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletedAccount && (
          <motion.div
            className="modal-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal deleted"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <i
                className="bi bi-x-circle"
                onClick={() => {
                  onClose();
                  setDeletedAccount(false);
                }}
              ></i>
              <img src="/redflix/deleted.svg" alt="Deletar conta" />
              <span>{deletedMessage}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalDelete;
