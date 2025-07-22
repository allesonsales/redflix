import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../contexts/AuthContexts";
import ModalPassword from "./components/modalPassword";
import ModalDelete from "./components/modalDelete";
import "./style.css";
import ModalNotification from "../modalNotification";

function Config() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [previewPhoto, setPreviewPhoto] = useState<string>("");
  const [newPhoto, setNewPhoto] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("token");

  const endereco = "http://localhost:3000";

  const auth = useContext(AuthContext);

  const uploadToCloud = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "redflix");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnpyshj4b/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file) {
      const urlPhoto = URL.createObjectURL(file);
      setPreviewPhoto(urlPhoto);
    }

    try {
      const uploadedUrl = await uploadToCloud(file);

      await fetch(`${endereco}/auth/atualizar-foto`, {
        method: `POST`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user?.id,
          photo: uploadedUrl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserPhoto(data.user.photo);
          setNotificationMessage(`Foto atualizada com sucesso!`);
          setNotificationOpen(true);

          if (auth?.login && auth?.token) {
            auth.login(auth.token, data.user);
          }
        });
    } catch (error) {
      setNotificationOpen(true);
      setNotificationMessage(
        error instanceof Error ? error.message : "Erro ao atualizar a foto"
      );
    }
  };

  const triggerInput = (e: React.MouseEvent) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  if (!auth) return null;
  const { user } = auth;

  useEffect(() => {
    if (user?.photo) {
      setUserPhoto(user.photo);
    } else {
      setUserPhoto(null);
    }
  }, [user]);

  return (
    <>
      <section id="configs">
        <h2>Configurações</h2>
        <div className="user-container">
          <div
            className="user-photo"
            onMouseEnter={() => setNewPhoto(true)}
            onMouseLeave={() => setNewPhoto(false)}
          >
            <input
              type="file"
              className="input-arquivo"
              name="photo"
              ref={inputRef}
              onChange={handlePhoto}
            />
            {newPhoto && (
              <div className="switch-photo" onClick={triggerInput}>
                <i className="bi bi-image-fill"></i>
                <small>Alterar foto</small>
              </div>
            )}
            {previewPhoto ? (
              <img src={previewPhoto} alt="" />
            ) : userPhoto ? (
              <img src={userPhoto} alt="" />
            ) : (
              <i className="bi bi-person-circle"></i>
            )}
          </div>
          <small className="small">Clique na imagem para alterar a foto</small>
          <div className="user-info">
            <h3>Dados do usuário</h3>
            <p>
              <strong>Nome: </strong>
              {user?.name}
            </p>
            <p>
              <strong>Usuário: </strong>
              {user?.userName}
            </p>
            <p>
              <strong>E-mail: </strong>
              {user?.email}
            </p>
            <p>
              <strong>Conta criada em: </strong>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "–"}
            </p>
          </div>
        </div>
        <div className="count-config">
          <h3>Gerenciamento da conta</h3>
          <div className="actions-container">
            <p
              className="config-action"
              onClick={() => {
                setIsOpen("password");
              }}
            >
              Alterar senha
            </p>
            <p
              className="config-action"
              onClick={() => {
                setIsOpen("delete");
              }}
            >
              Excluir Conta
            </p>
          </div>
        </div>

        <ModalNotification
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
          modalMessage={notificationMessage}
        />

        <ModalPassword isOpen={isOpen} onClose={() => setIsOpen(null)} />

        <ModalDelete
          user={user}
          isOpen={isOpen}
          onClose={() => setIsOpen(null)}
        />
      </section>
    </>
  );
}

export default Config;
