import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Main from './pages/Main';
import Profile from './pages/Profile';
import SocialComplete from './pages/SocialComplete';
import MainLayout from './components/layout/MainLayout';
import TestAIPage from './pages/CommitForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы (без шапки и меню) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/social-complete" element={<SocialComplete />} />

        {/* Приватные страницы (Внутри Layout) */}
        <Route element={<MainLayout />}>
          <Route path="/main" element={<Main />} />
          <Route path="/profile" element={<Profile />} />
          {/* В будущем добавим: /settings, /repos и т.д. */}
        </Route>

        <Route path="/test-ai" element={<TestAIPage />} />

      </Routes>
    </BrowserRouter>
  );
}