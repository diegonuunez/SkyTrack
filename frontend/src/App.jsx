import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Login from './pages/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import EditProfilePage from './pages/EditProfile'; 
import  MissionFeedPage  from "./pages/MissionFeedPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MissionFeedPage title="Descubre Misiones" feedType="feed" />} />
      
      <Route 
        path="/saved" 
        element={
          <PrivateRoute>
            <MissionFeedPage title="Misiones Guardadas" feedType="saved" />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/liked" 
        element={
          <PrivateRoute>
            <MissionFeedPage title="Misiones que te gustan" feedType="liked" />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/edit-profile" 
        element={
          <PrivateRoute>
            <EditProfilePage />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;