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

  const fetchComments = async () => {
    try {
      const res = await fetch("http://localhost:3000/comment/get", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId: movie.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments(data);
        console.log("funfou");
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
      }
    } catch (error) {
      setModalMessage("erro" + error);
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
      const res = await fetch("http://localhost:3000/comment/add", {
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
      const res = await fetch("http://localhost:3000/comment/delete", {
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
      const res = await fetch("http://localhost:3000/comment/like", {
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
      const res = await fetch("http://localhost:3000/comment/dislike", {
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
        <form onSubmit={handleComment}>
          <div className="form-control">
            <textarea
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Diz ai o que achou do filme?"
            ></textarea>
            <button type="submit">
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
                  {user?.photo ? (
                    <img src={user?.photo} alt={user.name} />
                  ) : (
                    <i className="bi bi-person-circle"></i>
                  )}
                  <small>{User?.username}</small>
                </div>
                <div className="actions-buttons">
                  <div className="likes">
                    {likes > 0 && <p>{likes}</p>}
                    <i
                      className="bi bi-hand-thumbs-up-fill"
                      onClick={() => upComment(id)}
                    ></i>
                  </div>
                  <div className="likes">
                    {dislikes > 0 && <p>{dislikes}</p>}
                    <i
                      className="bi bi-hand-thumbs-down-fill"
                      onClick={() => downComment(id)}
                    ></i>
                  </div>
                  {user?.id === commentUserId && (
                    <i
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
