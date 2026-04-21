import React, { useState, useContext } from 'react'; // 1. Importa useContext
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 2. Importa el Contexto

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { setToken } = useContext(AuthContext); // 3. Ahora sí existe
  const navigate = useNavigate();

  const login = async (username, password) => {
    const response = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Error');
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokens = await login(credentials.username, credentials.password);
      localStorage.setItem('token', tokens.access);
      setToken(tokens.access);
      navigate('/');
    } catch (err) {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar a SkyTrack</h2>
        <input 
          type="text" placeholder="Usuario" className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        />
        <input 
          type="password" placeholder="Contraseña" className="w-full p-3 mb-6 border rounded"
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;