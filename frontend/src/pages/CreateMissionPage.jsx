import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// IMPORTAMOS EL CONTEXTO Y EL SERVICIO
import { AuthContext } from '../context/AuthContext';
import { missionService } from '../services/missionService';

export const CreateMissionPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  
  // EXTRAEMOS EL TOKEN DEL USUARIO LOGUEADO
  const { token } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    drone_model: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [file, setFile] = useState(null); 
  const [isDragging, setIsDragging] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- MANEJADORES DE TEXTO ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- MANEJADORES DEL DRAG & DROP ---
  const handleDragOver = (e) => {
    e.preventDefault(); 
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
    } else {
      alert("⚠️ Formato incorrecto. Por favor, sube un archivo .csv con la telemetría.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  // --- MANEJADOR DE ENVÍO REAL ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Por favor, sube un archivo .csv con la ruta de la misión.");
      return;
    }
    if (!token) {
      alert("Debes iniciar sesión para crear una misión.");
      return;
    }

    setIsSubmitting(true);

    // 1. PREPARAMOS EL FORMDATA
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('drone_model', formData.drone_model);
    dataToSend.append('date', formData.date);
    dataToSend.append('file', file);

    try {
      // 2. ENVIAMOS AL BACKEND (Postgres + MongoDB)
      await missionService.uploadMission(dataToSend, token);
      
      alert("¡Misión publicada con éxito!");
      navigate('/'); // Redirigimos al Feed principal
      
    } catch (error) {
      console.error("Error al publicar la misión:", error);
      alert(error.message || "Hubo un error al subir la misión. Revisa tu archivo CSV.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-gray-500 hover:text-blue-600 font-bold flex items-center gap-2 transition-colors"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Planificar Misión</h1>
        <p className="text-gray-500 mb-8">Registra los detalles y sube la telemetría de tu vuelo.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la misión *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Ej: Exploración Costera" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Dron y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Modelo del Dron</label>
              <input type="text" name="drone_model" value={formData.drone_model} onChange={handleChange} placeholder="Ej: DJI Mavic 3" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Fecha del Vuelo *</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* ZONA DE DRAG & DROP PARA EL CSV */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Archivo de Telemetría (.csv) *</label>
            
            {!file ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()} 
                className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                <div className="text-4xl mb-3">{isDragging ? '📥' : '📄'}</div>
                <p className="text-gray-700 font-bold mb-1">
                  {isDragging ? '¡Suelta el archivo aquí!' : 'Arrastra tu archivo .csv aquí'}
                </p>
                <p className="text-sm text-gray-500">o haz clic para buscar en tu PC</p>
                
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="w-full border-2 border-green-200 bg-green-50 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-green-200 text-green-700 rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0">
                    ✓
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-green-900 truncate">{file.name}</p>
                    <p className="text-xs text-green-700">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg font-bold transition-colors ml-4 flex-shrink-0"
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
          </div>

          {/* Botones */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-100">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSubmitting ? 'Procesando...' : 'Crear Misión'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateMissionPage;