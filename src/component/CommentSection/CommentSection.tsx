import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContexts";
import ModalNotification from "../../pages/login/modalNotification";
import type { Comment, MovieForComment } from "../../interfaces";
import "./style.css";

type CommentSectionProps = {
  movie: MovieForComment;
  genresNames: string[];
};

function CommentSection({ movie, genresNames }: CommentSectionProps) {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const endereco = import.meta.env.VITE_BASE_URL;

  const fetchComments = async () => {
    try {
      const res = await fetch(`${endereco}/comment/get?movieId=${movie.id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setComments(data);
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (error) {
      setModalMessage("erro" + error);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (movie.id) {
      fetchComments();
    }
  }, [movie.id]);

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${endereco}/comment/add`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movie: {
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            genre_names: genresNames,
            vote_average: movie.vote_average,
            poster_path: movie.poster_path,
          },
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setModalMessage(data.message);
        setIsOpen(true);
        setComment("");
        fetchComments();
        setComments((prev) => [...prev]);
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (id: number) => {
    try {
      const res = await fetch(`${endereco}/comment/delete`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (res.ok) {
        setModalMessage(data.message);
        setIsOpen(true);
        fetchComments();
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const upComment = async (id: number) => {
    try {
      const res = await fetch(`${endereco}/comment/like`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchComments();
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const downComment = async (id: number) => {
    try {
      const res = await fetch(`${endereco}/comment/dislike`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchComments();
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!auth) return null;

  const { user } = auth;

  return (
    <>
      <div className="add-coment">
        <h3>Adicionar um comentário:</h3>
        <form aria-label="Adicionar um comentário" onSubmit={handleComment}>
          <div className="form-control">
            <textarea
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Diz ai o que achou do filme?"
            ></textarea>
            <button type="submit" aria-label="Adicionar comentário">
              <i className="bi bi-plus-circle-fill"></i>
            </button>
          </div>
        </form>
      </div>
      <div className="comments-container">
        <h3>O que estão dizendo sobre o filme?</h3>
        {comments.map(
          ({
            id,
            userId: commentUserId,
            likes,
            dislikes,
            title,
            comment,
            User,
          }) => (
            <blockquote key={id}>
              <h4>{title}</h4>
              <figcaption>"{comment}"</figcaption>
              <div className="actions">
                <div className="user">
                  {User?.photo ? (
                    <img src={User?.photo} alt={User?.username} />
                  ) : (
                    <i className="bi bi-person-circle"></i>
                  )}
                  <small>{User?.username}</small>
                </div>
                <div className="actions-buttons">
                  <div className="likes">
                    {likes > 0 && (
                      <p aria-label={"Esse comentário tem " + likes + " likes"}>
                        {likes}
                      </p>
                    )}
                    <i
                      aria-label="Dar like"
                      className="bi bi-hand-thumbs-up-fill"
                      onClick={() => upComment(id)}
                    ></i>
                  </div>
                  <div className="likes">
                    {dislikes > 0 && (
                      <p
                        aria-label={
                          "Esse comentário tem " + dislikes + " dislikes"
                        }
                      >
                        {dislikes}
                      </p>
                    )}
                    <i
                      aria-label="Dar dislike"
                      className="bi bi-hand-thumbs-down-fill"
                      onClick={() => downComment(id)}
                    ></i>
                  </div>
                  {user?.id === commentUserId && (
                    <i
                      aria-label="Excluir seu comentário"
                      className="bi bi-trash3-fill"
                      onClick={() => deleteComment(id)}
                    ></i>
                  )}
                </div>
              </div>
            </blockquote>
          )
        )}
      </div>
      <ModalNotification
        isOpen={isOpen}
        modalMessage={modalMessage}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}

export default CommentSection;
