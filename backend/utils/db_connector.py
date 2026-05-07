# backend/utils/db_connector.py
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['skytrack_telemetry_db'] 

def get_telemetry_collection():
    return db['telemetry_points']