import { Routes, Route } from 'react-router-dom';
import MissionFeedPage from './pages/MissionFeedPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import EditProfilePage from './pages/EditProfile';
import CreateMissionPage from './pages/CreateMissionPage';
import MissionDetailsPage from './pages/MissionDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MissionFeedPage title="Descubre Misiones" feedType="feed" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mission/:id" element={<MissionDetailsPage />} />
      <Route path="/saved" element={<PrivateRoute><MissionFeedPage title="Misiones Guardadas" feedType="saved" /></PrivateRoute>} />
      <Route path="/liked" element={<PrivateRoute><MissionFeedPage title="Misiones que te gustan" feedType="liked" /></PrivateRoute>} />
      <Route path="/create-mission" element={<PrivateRoute><CreateMissionPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
      <Route path="*" element={
        <div className="page-wrapper">
          <div className="container text-center pt-16">
            <p className="font-bold text-muted">404 — Ruta no encontrada</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
