import { Routes, Route } from 'react-router-dom';
import  Home  from './pages/Home'; 
import  Login from './pages/Login';
import  Profile  from './pages/Profile';
import  PrivateRoute  from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/login" element={<Login />} />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;