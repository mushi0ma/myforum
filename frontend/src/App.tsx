import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLoading } from '@/components/ui/spinner';
import MainLayout from './components/layout/MainLayout';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const SocialComplete = lazy(() => import('./pages/SocialComplete'));
const Profile = lazy(() => import('./pages/Profile'));
const Main = lazy(() => import('./pages/Main'));
const Settings = lazy(() => import('./pages/Settings'));
const Trending = lazy(() => import('./pages/Trending'));
const Explore = lazy(() => import('./pages/Explore'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Tags = lazy(() => import('./pages/Tags'));
const NewPost = lazy(() => import('./pages/NewPost'));
const TestAIPage = lazy(() => import('./pages/CommitForm'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/social-complete" element={<SocialComplete />} />
          <Route path="/profile" element={<Profile />} />

          {/* Protected Pages (Inside Layout) */}
          <Route element={<MainLayout />}>
            <Route path="/main" element={<Main />} />
            <Route path="/feed" element={<Main />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/new" element={<NewPost />} />
          </Route>

          <Route path="/test-ai" element={<TestAIPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
