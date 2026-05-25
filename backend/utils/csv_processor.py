import pandas as pd
import numpy as np

class CSVProcessor:
    COLUMN_MAPPING = {
        'lat': 'latitude',
        'latitud': 'latitude',
        'lon': 'longitude',
        'lng': 'longitude',
        'altitude(feet)': 'alt_ft',
        'altitude': 'alt_m',
        'speed(mph)': 'vel_mph',
        'speed': 'vel_ms',
        'battery_%': 'battery'
    }

    @staticmethod
    def process_telemetry_file(file_obj):
        df = pd.read_csv(file_obj)
        df.rename(columns=CSVProcessor.COLUMN_MAPPING, inplace=True)

        if 'alt_ft' in df.columns:
            df['alt_m'] = df['alt_ft'] * 0.3048
            df.drop(columns=['alt_ft'], inplace=True)

        if 'vel_mph' in df.columns:
            df['vel_ms'] = df['vel_mph'] * 0.44704
            df.drop(columns=['vel_mph'], inplace=True)

        if 'vel_ms' not in df.columns:
            df['vel_ms'] = 0.0

        required_cols = ['timestamp', 'latitude', 'longitude', 'alt_m']

        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            raise ValueError(f"El CSV no contiene las columnas necesarias. Faltan: {missing_cols}")

        df.dropna(subset=required_cols, inplace=True)

        df['vel_ms'] = df['vel_ms'].fillna(0.0)

        return df.to_dict(orient='records')
