import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { missionService } from '../services/missionService';
import Navbar from '../components/Navbar';

export const CreateMissionPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    drone_model: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [file, setFile]             = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
    } else {
      alert('⚠️ Formato incorrecto. Por favor, sube un archivo .csv con la telemetría.');
    }
  };

  const handleDrop       = (e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); };
  const handleFileChange = (e) => processFile(e.target.files[0]);

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)  { alert('Por favor, sube un archivo .csv con la ruta de la misión.'); return; }
    if (!user)  { alert('Debes iniciar sesión para crear una misión.'); return; }

    setIsSubmitting(true);
    const dataToSend = new FormData();
    dataToSend.append('name',        formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('drone_model', formData.drone_model);
    dataToSend.append('date',        formData.date);
    dataToSend.append('file',        file);

    try {
      await missionService.uploadMission(dataToSend);
      alert('¡Misión publicada con éxito!');
      navigate('/');
    } catch (error) {
      alert(error.message || 'Hubo un error al subir la misión. Revisa tu archivo CSV.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container container--md">

          <button onClick={() => navigate(-1)} className="btn btn--ghost btn--sm anim-fade-up mb-6">
            ← Volver
          </button>

          <div className="card anim-fade-up">
            <h1 className="create-title">
              Planificar <span className="text-gradient">Misión</span>
            </h1>
            <p className="text-secondary create-subtitle">
              Registra los detalles y sube la telemetría de tu vuelo.
            </p>

            <form onSubmit={handleSubmit} className="create-form">

              <div className="input-group">
                <label className="input-label">Nombre de la misión *</label>
                <input
                  type="text" name="name" required value={formData.name}
                  onChange={handleChange} placeholder="Ej: Exploración Costera"
                  className="input"
                />
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Modelo del Dron</label>
                  <input
                    type="text" name="drone_model" value={formData.drone_model}
                    onChange={handleChange} placeholder="Ej: DJI Mavic 3"
                    className="input"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Fecha del Vuelo *</label>
                  <input
                    type="date" name="date" required value={formData.date}
                    onChange={handleChange} className="input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Archivo de Telemetría (.csv) *</label>
                {!file ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`dropzone${isDragging ? ' dropzone--active' : ''}`}
                  >
                    <div className="dropzone-icon">{isDragging ? '📥' : '📄'}</div>
                    <p className="dropzone-label">
                      {isDragging ? '¡Suelta el archivo aquí!' : 'Arrastra tu archivo .csv aquí'}
                    </p>
                    <p className="text-sm text-muted">o haz clic para buscar en tu PC</p>
                    <input
                      type="file" accept=".csv"
                      ref={fileInputRef} onChange={handleFileChange}
                      className="file-input-hidden"
                    />
                  </div>
                ) : (
                  <div className="file-ready">
                    <div className="file-ready-info">
                      <div className="file-ready-icon">✓</div>
                      <div>
                        <p className="file-ready-name">{file.name}</p>
                        <p className="text-xs file-ready-size">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button type="button" onClick={removeFile} className="btn btn--danger btn--sm">
                      Cambiar
                    </button>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">Descripción</label>
                <textarea
                  name="description" rows={3} value={formData.description}
                  onChange={handleChange} className="input"
                />
              </div>

              <div className="create-form-footer">
                <button type="button" onClick={() => navigate(-1)} className="btn btn--ghost">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn--primary">
                  {isSubmitting ? 'Procesando...' : 'Crear Misión'}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default CreateMissionPage;
