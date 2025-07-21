import React, { useRef } from "react";
import "./style.css";
import type { photoProps } from "../../interfaces";

function UploadPhoto({
  onFileChange,
  onPhotoChange,
  onPreviewChange,
  photo,
}: photoProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoChange(file.name);
      const urlPhoto = URL.createObjectURL(file);
      onPreviewChange(urlPhoto);

      if (onFileChange) {
        onFileChange(file);
      }
    }
  };

  const triggerInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        className="input-arquivo"
        name="photo"
        ref={inputRef}
        onChange={handleFile}
      />
      <div className="form-control container-file">
        <button className="enviar-arquivo" onClick={triggerInput}>
          {photo ? "Alterar foto" : "Enviar foto"}
        </button>
        {photo && <small>{photo}</small>}
      </div>
    </>
  );
}

export default UploadPhoto;
