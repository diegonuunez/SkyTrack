import pandas as pd
import numpy as np

class CSVProcessor:
    # Ajustamos el mapeo para saber exactamente qué columnas necesitan conversión matemática
    COLUMN_MAPPING = {
        'lat': 'latitude',
        'latitud': 'latitude',
        'lon': 'longitude',
        'lng': 'longitude',
        'altitude(feet)': 'alt_ft', # Renombramos a ft temporalmente
        'altitude': 'alt_m',
        'speed(mph)': 'vel_mph',    # Renombramos a mph temporalmente
        'speed': 'vel_ms',
        'battery_%': 'battery'
    }

    @staticmethod
    def process_telemetry_file(file_obj):
        """
        Lee el CSV (archivo en memoria de Django), normaliza columnas, 
        convierte unidades y devuelve una lista de diccionarios.
        """
        # Pandas lee el objeto directamente de la memoria de Django
        df = pd.read_csv(file_obj)
        df.rename(columns=CSVProcessor.COLUMN_MAPPING, inplace=True)

        # 1. CONVERSIONES MATEMÁTICAS REAIES
        if 'alt_ft' in df.columns:
            df['alt_m'] = df['alt_ft'] * 0.3048  # Pies a Metros
            df.drop(columns=['alt_ft'], inplace=True)

        if 'vel_mph' in df.columns:
            df['vel_ms'] = df['vel_mph'] * 0.44704 # Millas/h a Metros/s
            df.drop(columns=['vel_mph'], inplace=True)

        # Si el CSV no tiene velocidad, la creamos con ceros para no romper el front
        if 'vel_ms' not in df.columns:
            df['vel_ms'] = 0.0

        # 2. VALIDACIÓN ESTRICTA
        required_cols = ['timestamp', 'latitude', 'longitude', 'alt_m']
        
        # Comprobamos si falta alguna columna vital ANTES de intentar borrar nulos
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            raise ValueError(f"El CSV no contiene las columnas necesarias. Faltan: {missing_cols}")

        # Limpiamos filas corruptas (donde falte el GPS o el tiempo)
        df.dropna(subset=required_cols, inplace=True)
        
        # Opcional pero recomendado: Rellenar velocidades vacías (NaN) con 0
        df['vel_ms'] = df['vel_ms'].fillna(0.0)
        
        return df.to_dict(orient='records')