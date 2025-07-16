import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import logging

class DBManager:
    def __init__(self) -> None:
        credentials_path = os.getenv('FIREBASE_CREDENTIALS_PATH', './firebase_key.json')
        self.db = None
        self._initialize_firebase(credentials_path)
    
    def _initialize_firebase(self, credentials_path: str) -> None:
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(credentials_path)
                firebase_admin.initialize_app(cred)
            
            self.db = firestore.client()
            logging.info("Successfully connected to Firestore.")
            
        except FileNotFoundError:
            logging.error(f"Firebase credentials file not found: {credentials_path}")
        except ValueError as e:
            logging.error(f"Invalid credentials format: {e}")
        except Exception as e:
            logging.error(f"Failed to connect to Firestore: {e}")

    
    def is_connected(self) -> bool:
        """Check if database connection is active"""
        return self.db is not None

    def get_db(self):
        """Get database client with validation"""
        if not self.is_connected():
            raise ConnectionError("Database not connected. Check initialization.")
        return self.db