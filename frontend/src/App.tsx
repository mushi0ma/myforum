import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SocialComplete from './pages/SocialComplete';
import Trending from './pages/Trending';
import Explore from './pages/Explore';
import PostDetail from './pages/PostDetail';
import Bookmarks from './pages/Bookmarks';
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
        <Route path="/profile" element={<Profile />} />

        {/* Приватные страницы (Внутри Layout) */}
        <Route element={<MainLayout />}>
          <Route path="/main" element={<Main />} />
          <Route path="/feed" element={<Main />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Route>

        <Route path="/test-ai" element={<TestAIPage />} />

      </Routes>
    </BrowserRouter>
  );
}