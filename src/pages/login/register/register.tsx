import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContexts";
import ModalNotification from "../modalNotification";
import UploadPhoto from "../../../component/uploadPhoto/uploadPhoto";

function Register() {
  const [name, setName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    return null;
  }

  const { login } = auth;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = "";

    if (photoFile) {
      const upload = await uploadToCloud(photoFile);
      if (upload) {
        imageUrl = upload;
      }
    }

    try {
      const res = await fetch("http://localhost:3000/auth/registre-se", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name,
          userName,
          email,
          password,
          confirmPassword,
          photo: imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        login(data.token, data.user);
        navigate("/filmes");
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <>
      <section id="login">
        <div className="login-container">
          <h1>Criar conta</h1>
          {photo && <img src={previewPhoto} className="photo-user" />}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome..."
              />
            </div>
            <div className="form-control">
              <input
                type="text"
                name="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Digite um nome de usuário..."
              />
            </div>
            <div className="form-control">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail..."
              />
            </div>
            <div className="form-control">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha..."
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
            <div className="form-control">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
              />
              <button
                type="button"
                onClick={() => {
                  setShowConfirmPassword((prev) => !prev);
                }}
                className="password"
              >
                <i
                  className={
                    showConfirmPassword
                      ? "bi bi-eye-fill"
                      : "bi bi-eye-slash-fill"
                  }
                ></i>
              </button>
            </div>
            <UploadPhoto
              photo={photo}
              onPhotoChange={setPhoto}
              onPreviewChange={setPreviewPhoto}
              onFileChange={setPhotoFile}
            />
            <input type="submit" value="Cadastrar" />
          </form>
        </div>
        <ModalNotification
          modalMessage={modalMessage}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </section>
    </>
  );
}

export default Register;
