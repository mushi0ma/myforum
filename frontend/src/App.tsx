import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Main from './pages/Main';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page на корневом адресе */}
        <Route path="/" element={<Landing />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard (куда редиректит Django) */}
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}