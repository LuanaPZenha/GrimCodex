import { Navigate, Route, Routes } from 'react-router-dom';
import DiabloBackground from './components/DiabloBackground';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import { UsersPage } from './pages/Users';
import { ItemsPage } from './pages/Items';
import { MountsPage } from './pages/Mounts';
import ForumPage from './pages/Forum';
import PostDetailPage from './pages/Forum/PostDetail';
import PlayersPage from './pages/Players';
import PlayerProfilePage from './pages/Players/Profile';

export default function App() {
  return (
    <div className="relative min-h-screen">
      <DiabloBackground />
      <div className="relative z-10">
        <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cadastro" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<HomePage />} />
        <Route
          path="users"
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />
        <Route path="items" element={<ItemsPage />} />
        <Route path="mounts" element={<MountsPage />} />
        <Route path="forum" element={<ForumPage />} />
        <Route path="forum/:id" element={<PostDetailPage />} />
        <Route path="players" element={<PlayersPage />} />
        <Route path="players/:username" element={<PlayerProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}
