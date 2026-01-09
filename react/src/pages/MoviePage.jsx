import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    user_name: '',
    comment_text: ''
  });
  const [loading, setLoading] = useState(true);

  // Функция загрузки данных о фильме
  const fetchMovie = async () => {
    try {
      const response = await axios.get(`http://online-cinema/api/movie.php?id=${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Ошибка загрузки фильма:', error);
      navigate('/');
    }
  };

  // Функция загрузки комментариев из БД
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://online-cinema/api/comments.php?movie_id=${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
    }
  };

  // Загружаем данные
  useEffect(() => {
    const loadData = async () => {
      await fetchMovie();
      await fetchComments();
      setLoading(false);
    };
    loadData();
  }, [id]);

  // Функция добавления комментария
  const handleAddComment = async () => {
    if (!newComment.comment_text.trim()) {
      alert('Введите текст комментария');
      return;
    }

    const commentData = {
      movie_id: parseInt(id),
      user_name: newComment.user_name || 'Аноним',
      comment_text: newComment.comment_text
    };

    try {
      await axios.post('http://online-cinema/api/comments.php', commentData);
      // Обновляем список комментариев
      fetchComments();
      // Очищаем форму
      setNewComment({ user_name: '', comment_text: '' });
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
      alert('Ошибка при добавлении комментария');
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!movie) return <div className="loading">Загрузка...</div>;

  return (
    <div className="movie-detail">
      <button onClick={() => navigate(-1)} className="back-btn">← Назад</button>
      
      <div className="movie-header">
        <img 
          src={`http://online-cinema/${movie.image_url}`} 
          alt={movie.title}
          onError={(e) => {
            e.target.src = 'http://online-cinema/images/default.jpg';
          }}
        />
        <div className="movie-details">
          <h1>{movie.title} ({movie.year})</h1>
          <div className="meta">
            <span>{movie.genre}</span>
            <span>{movie.duration} мин</span>
            <span>{movie.rating}/10</span>
          </div>
          <p className="description">{movie.description}</p>
        </div>
      </div>

      {/* Блок комментариев с сохранением в БД */}
      <div className="comments-section">
        <h2>Комментарии ({comments.length})</h2>
        
        {/* Форма добавления комментария */}
        <div className="add-comment">
          <input
            type="text"
            placeholder="Ваше имя (необязательно)"
            value={newComment.user_name}
            onChange={(e) => setNewComment({...newComment, user_name: e.target.value})}
            className="comment-name-input"
          />
          <textarea 
            value={newComment.comment_text}
            onChange={(e) => setNewComment({...newComment, comment_text: e.target.value})}
            placeholder="Оставьте ваш отзыв..."
            rows="3"
            required
          />
          <button onClick={handleAddComment}>Добавить комментарий</button>
        </div>

        {/* Список комментариев */}
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.user_name}</strong>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="comment-text">{comment.comment_text}</p>
              </div>
            ))
          ) : (
            <p>Пока нет комментариев. Будьте первым!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoviePage;