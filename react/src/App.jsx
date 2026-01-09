import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import MoviePage from './pages/MoviePage';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(auth);
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', user.username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <nav>
            <Link to="/" className="logo">🎬 Онлайн-кинотека</Link>
            <div className="nav-links">
              <Link to="/">Главная</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/admin">Админ</Link>
                  <button onClick={handleLogout} className="btn-logout-small">
                    Выйти
                  </button>
                </>
              ) : (
                <Link to="/login">Вход для админа</Link>
              )}
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route 
              path="/admin" 
              element={
                isAuthenticated ? <Admin /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/admin" />
                )
              } 
            />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2025 Онлайн-кинотека. Курсовая работа.</p>
          {isAuthenticated && (
            <p className="user-info">
              Вы вошли как: <strong>{localStorage.getItem('username')}</strong>
            </p>
          )}
        </footer>
      </div>
    </Router>
  );
}

export default App;