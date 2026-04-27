import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // <-- IMPORTA EL NAVBAR AQUÍ
import Home from './pages/Home'; 
import Login from './pages/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import EditProfilePage from './pages/EditProfile'; 
import MissionFeedPage from './pages/MissionFeedPage';
import MissionDetailsPage from './pages/MissionDetailsPage';

function App() {
  return (
    // Envolvemos todo en un div opcional para estructura
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. EL NAVBAR SE QUEDA AQUÍ ARRIBA, FUERA DE LAS RUTAS */}
      <Navbar />

      {/* 2. SOLO ESTA SECCIÓN CAMBIA AL NAVEGAR */}
      <main>
        <Routes>
          <Route path="/" element={<MissionFeedPage title="Descubre Misiones" feedType="feed" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mission/:id" element={<MissionDetailsPage />} />
          <Route path="/saved" element={<PrivateRoute><MissionFeedPage title="Misiones Guardadas" feedType="saved" /></PrivateRoute>} />
          <Route path="/liked" element={<PrivateRoute><MissionFeedPage title="Misiones que te gustan" feedType="liked" /></PrivateRoute>} />
          
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
        </Routes>
      </main>

    </div>
  );
}

export default App;