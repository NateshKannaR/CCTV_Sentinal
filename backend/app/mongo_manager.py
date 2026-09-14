import logging
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from pymongo import MongoClient, UpdateOne
from backend.app.config import MONGODB_URI, MONGODB_DB_NAME
from backend.app.db import get_db_connection

logger = logging.getLogger("sentinel.mongodb")

class MongoManager:
    """
    Manages direct connection, synchronization, and operations with MongoDB Atlas.
    """
    def __init__(self, uri: str = MONGODB_URI, db_name: str = MONGODB_DB_NAME):
        self.uri = uri
        self.db_name = db_name
        self.client: Optional[MongoClient] = None
        self.db = None
        self.is_connected = False
        self._init_connection()

    def _init_connection(self):
        try:
            self.client = MongoClient(
                self.uri,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                maxPoolSize=20,
                retryWrites=True
            )
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            self.is_connected = True
            logger.info(f"Connected successfully to MongoDB Atlas database: '{self.db_name}'")
            self._ensure_indexes()
        except Exception as e:
            self.is_connected = False
            logger.warning(f"Could not establish connection to MongoDB Atlas: {e}")

    def _ensure_indexes(self):
        if not self.is_connected or self.db is None:
            return
        try:
            self.db.cameras.create_index("id", unique=True)
            self.db.watchlist.create_index("plate_number", unique=True)
            self.db.detections.create_index([("plate_number", 1), ("timestamp", -1)])
            self.db.alerts.create_index([("plate_number", 1), ("timestamp", -1)])
            logger.info("MongoDB Atlas indexes ensured.")
        except Exception as e:
            logger.warning(f"Error creating indexes: {e}")

    def get_status(self) -> Dict[str, Any]:
        if not self.is_connected or self.client is None:
            self._init_connection()

        if not self.is_connected or self.client is None:
            return {
                "connected": False,
                "database": self.db_name,
                "error": "Failed to connect to MongoDB Atlas cluster",
                "collections": [],
                "counts": {}
            }

        try:
            t0 = time.time()
            self.client.admin.command('ping')
            latency_ms = round((time.time() - t0) * 1000, 2)
            
            collections = self.db.list_collection_names()
            counts = {
                c: self.db[c].count_documents({}) for c in collections
            }

            return {
                "connected": True,
                "database": self.db_name,
                "cluster_uri": self.uri.split('@')[-1].split('/')[0] if '@' in self.uri else 'MongoDB Atlas',
                "latency_ms": latency_ms,
                "collections": collections,
                "counts": counts,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "connected": False,
                "database": self.db_name,
                "error": str(e),
                "collections": [],
                "counts": {}
            }

    def sync_from_sqlite(self) -> Dict[str, int]:
        """
        Synchronizes all camera nodes, watchlist items, detections, and alerts
        from SQLite into MongoDB Atlas using idempotent bulk upserts.
        """
        if not self.is_connected or self.db is None:
            self._init_connection()
            if not self.is_connected:
                logger.warning("Skipping sync: MongoDB Atlas is offline")
                return {"synced_cameras": 0, "synced_watchlist": 0, "synced_detections": 0, "synced_alerts": 0}

        counts = {"synced_cameras": 0, "synced_watchlist": 0, "synced_detections": 0, "synced_alerts": 0}

        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # 1. Sync Cameras
            cursor.execute("SELECT * FROM cameras")
            cameras = [dict(row) for row in cursor.fetchall()]
            if cameras:
                cam_ops = [
                    UpdateOne({"id": c["id"]}, {"$set": c}, upsert=True)
                    for c in cameras
                ]
                res = self.db.cameras.bulk_write(cam_ops)
                counts["synced_cameras"] = res.upserted_count + res.modified_count + res.matched_count

            # 2. Sync Watchlist
            cursor.execute("SELECT * FROM watchlist")
            watchlist = [dict(row) for row in cursor.fetchall()]
            if watchlist:
                wl_ops = [
                    UpdateOne({"plate_number": w["plate_number"]}, {"$set": w}, upsert=True)
                    for w in watchlist
                ]
                res = self.db.watchlist.bulk_write(wl_ops)
                counts["synced_watchlist"] = res.upserted_count + res.modified_count + res.matched_count

            # 3. Sync Detections
            cursor.execute("SELECT * FROM detections")
            detections = [dict(row) for row in cursor.fetchall()]
            if detections:
                det_ops = [
                    UpdateOne({"id": d["id"]}, {"$set": d}, upsert=True)
                    for d in detections
                ]
                res = self.db.detections.bulk_write(det_ops)
                counts["synced_detections"] = res.upserted_count + res.modified_count + res.matched_count

            # 4. Sync Alerts
            cursor.execute("SELECT * FROM alerts")
            alerts = [dict(row) for row in cursor.fetchall()]
            if alerts:
                alt_ops = [
                    UpdateOne({"id": a["id"]}, {"$set": a}, upsert=True)
                    for a in alerts
                ]
                res = self.db.alerts.bulk_write(alt_ops)
                counts["synced_alerts"] = res.upserted_count + res.modified_count + res.matched_count

            conn.close()
            logger.info(f"MongoDB Atlas synchronization complete: {counts}")
        except Exception as e:
            logger.error(f"Error during SQLite -> MongoDB Atlas sync: {e}")

        return counts

    def insert_watchlist(self, item: Dict[str, Any]):
        if self.is_connected and self.db is not None:
            try:
                self.db.watchlist.update_one(
                    {"plate_number": item.get("plate_number")},
                    {"$set": item},
                    upsert=True
                )
            except Exception as e:
                logger.warning(f"Failed to upsert watchlist to MongoDB: {e}")

    def insert_detection(self, det: Dict[str, Any]):
        if self.is_connected and self.db is not None:
            try:
                self.db.detections.update_one(
                    {"id": det.get("id")},
                    {"$set": det},
                    upsert=True
                )
            except Exception as e:
                logger.warning(f"Failed to upsert detection to MongoDB: {e}")

    def insert_alert(self, alert: Dict[str, Any]):
        if self.is_connected and self.db is not None:
            try:
                self.db.alerts.update_one(
                    {"id": alert.get("id")},
                    {"$set": alert},
                    upsert=True
                )
            except Exception as e:
                logger.warning(f"Failed to upsert alert to MongoDB: {e}")

    def acknowledge_alert(self, alert_id: str):
        if self.is_connected and self.db is not None:
            try:
                self.db.alerts.update_one(
                    {"id": alert_id},
                    {"$set": {"status": "ACKNOWLEDGED", "acknowledged_at": datetime.now().isoformat()}}
                )
            except Exception as e:
                logger.warning(f"Failed to update alert in MongoDB: {e}")

# Global singleton
mongo_manager = MongoManager()
