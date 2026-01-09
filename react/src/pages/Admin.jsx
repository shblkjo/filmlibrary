import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    genre: '',
    duration: '',
    rating: 0,
    image: null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Проверяем авторизацию через localStorage
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuth) {
      navigate('/login');
      return;
    }
    
    // Если авторизован, загружаем фильмы
    fetchMovies();
  }, []);

  // Функция загрузки фильмов
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://online-cinema/api/movies.php');
      setMovies(response.data);
    } catch (error) {
      console.error('Ошибка загрузки фильмов:', error);
      alert('Ошибка загрузки фильмов');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  console.log('Form Data:', formData); // Отладка
  
  const data = new FormData();
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('year', formData.year);
  data.append('genre', formData.genre);
  data.append('duration', formData.duration);
  data.append('rating', formData.rating);
  
  if (formData.image) {
    console.log('Image file:', formData.image); // Отладка
    data.append('image', formData.image);
  }
  
  // Проверяем, что все поля заполнены
  for (let [key, value] of data.entries()) {
    console.log(key, value);
  }
  
  try {
    console.log('Sending request...');
    const response = await axios.post('http://online-cinema/api/add_movie.php', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Response:', response.data);
    alert(response.data.success || response.data.error);
    
      
      // Очищаем форму и обновляем список
      setFormData({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        genre: '',
        duration: '',
        rating: 0,
        image: null
      });
      fetchMovies();
    } catch (error) {
      console.error('Ошибка добавления фильма:', error);
      alert('Ошибка при добавлении фильма');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот фильм?')) return;
    
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) {
      alert('Требуется авторизация!');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.delete('http://online-cinema/api/delete_movie.php', {
        data: { id }
      });
      alert(response.data.success || response.data.error);
      fetchMovies();
    } catch (error) {
      console.error('Ошибка удаления фильма:', error);
      alert('Ошибка при удалении фильма');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка фильмов...</div>;
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Панель администратора</h1>
      </div>
      
      <div className="admin-section">
        <h2>Добавить новый фильм</h2>
        <form onSubmit={handleSubmit} className="movie-form">
          <input
            type="text"
            name="title"
            placeholder="Название фильма"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
          <textarea
            name="description"
            placeholder="Описание фильма"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="form-control"
          />
          <div className="form-row">
            <input
              type="number"
              name="year"
              placeholder="Год выпуска"
              value={formData.year}
              onChange={handleChange}
              required
              min="1900"
              max="2030"
              className="form-control"
            />
            <input
              type="text"
              name="genre"
              placeholder="Жанр (через запятую)"
              value={formData.genre}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-row">
            <input
              type="number"
              name="duration"
              placeholder="Длительность (мин)"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              className="form-control"
            />
            <input
              type="number"
              name="rating"
              placeholder="Рейтинг (0-10)"
              value={formData.rating}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="10"
              className="form-control"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
          <button type="submit" className="btn btn-submit">Добавить фильм</button>
        </form>
      </div>

      <div className="admin-section">
        <h2>Управление фильмами ({movies.length})</h2>
        <div className="movies-list">
          {movies.map(movie => (
            <div key={movie.id} className="admin-movie-card">
              <img 
                src={`http://online-cinema/${movie.image_url}`} 
                alt={movie.title}
                onError={(e) => {
                  e.target.src = 'http://online-cinema/images/default.jpg';
                }}
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>Жанр: {movie.genre}</p>
                <p>Год: {movie.year}</p>
              </div>
              <button 
                onClick={() => handleDelete(movie.id)}
                className="btn btn-delete"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;