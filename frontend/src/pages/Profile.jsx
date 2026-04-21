// frontend/src/pages/Profile.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import { ProfileCard } from '../components/ProfileCard';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Mi Perfil</h1>
        <ProfileCard />
      </main>
    </div>
  );
};

export default Profile;