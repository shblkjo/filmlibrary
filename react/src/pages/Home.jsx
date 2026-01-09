import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Функция для загрузки фильмов из БД
  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://online-cinema/api/movies.php');
      setMovies(response.data);
    } catch (error) {
      console.error('Ошибка загрузки фильмов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем фильмы при монтировании компонента
  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка фильмов...</div>;
  }

  return (
    <div className="home">
      <h1>Список фильмов</h1>
      
      {/* Фильтр по жанрам (динамическое изменение информации) */}
      <div className="filters">
        <button onClick={() => fetchMovies()}>Все</button>
        <button onClick={async () => {
          const response = await axios.get('http://online-cinema/api/movies.php');
          const filtered = response.data.filter(m => m.genre.includes('фэнтези'));
          setMovies(filtered);
        }}>Фэнтези</button>
        <button onClick={async () => {
          const response = await axios.get('http://online-cinema/api/movies.php');
          const filtered = response.data.filter(m => m.genre.includes('драма'));
          setMovies(filtered);
        }}>Драма</button>
        <button onClick={async () => {
          const response = await axios.get('http://online-cinema/api/movies.php');
          const filtered = response.data.filter(m => m.genre.includes('комедия'));
          setMovies(filtered);
        }}>Комедия</button>
      </div>

      {/* Сетка фильмов (3 информационных блока в ряд) */}
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img 
              src={`http://online-cinema/${movie.image_url}`} 
              alt={movie.title} 
              onError={(e) => {
                e.target.src = 'http://online-cinema/images/default.jpg';
              }}
            />
            <div className="movie-info">
              <h3>{movie.title} ({movie.year})</h3>
              <p className="genre">{movie.genre}</p>
              <p className="rating">⭐ {movie.rating}</p>
              <Link to={`/movie/${movie.id}`} className="btn">Подробнее</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;