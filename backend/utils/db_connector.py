# backend/utils/db_connector.py
import os
from pymongo import MongoClient

client = MongoClient(os.getenv('MONGO_URL', 'mongodb://localhost:27017/'))
db = client['skytrack_telemetry_db'] 

def get_telemetry_collection():
    return db['telemetry_points']