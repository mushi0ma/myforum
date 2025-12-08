// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Main from './pages/Main';
import SocialComplete from './pages/SocialComplete'; // <--- Импорт

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Маршрут-мост для завершения регистрации */}
        <Route path="/social-complete" element={<SocialComplete />} />

        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}