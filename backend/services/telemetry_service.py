import pymongo
from utils.db_connector import get_telemetry_collection

class TelemetryService:
    @staticmethod
    def save_mission_telemetry(mission_id, data):
        collection = get_telemetry_collection()
        
        if not data:
            return None
            
        for point in data:
            point['mission_id'] = mission_id
            
        result = collection.insert_many(data)
        
        collection.create_index([("mission_id", pymongo.ASCENDING)], background=True)
        
        return result

    @staticmethod
    def get_mission_telemetry(mission_id):
        collection = get_telemetry_collection()
        cursor = collection.find(
            {"mission_id": mission_id}, 
            {"_id": 0, "timestamp": 1, "latitude": 1, "longitude": 1, "alt_m": 1, "vel_ms": 1}
        ).sort("timestamp", pymongo.ASCENDING)
        
        return list(cursor)