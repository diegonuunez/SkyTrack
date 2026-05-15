import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; 
import CreateMissionPage from './pages/CreateMissionPage';
import Login from './pages/Login';
import Profile from './pages/Profile'; // <-- Este es el que tiene la lógica dual
import PrivateRoute from './components/PrivateRoute';
import EditProfilePage from './pages/EditProfile'; 
import MissionFeedPage from './pages/MissionFeedPage';
import MissionDetailsPage from './pages/MissionDetailsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <Navbar />

      <main>
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

          <Route path="*" element={<div className="p-10 text-center">Ruta no encontrada</div>} />
        </Routes>
      </main>

    </div>
  );
}

export default App;