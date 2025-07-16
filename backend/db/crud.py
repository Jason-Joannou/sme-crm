from models.config import allowed_models
from firebase_admin import firestore

def create_firebase_collection(db: firestore.client , collection_name: str, collection_id: str, collection_obj: allowed_models) -> str:
    try:
        doc_ref = db.collection(collection_name).document(collection_id)
        doc_ref.set(collection_obj.model_dump())
        return doc_ref.id
    except Exception as e:
        raise Exception(f"Failed to create document: {e}")
    
def update_firebase_collection(db: firestore.client, collection_name: str, collection_id: str, collection_obj: allowed_models) -> None:
    try:
        doc_ref = db.collection(collection_name).document(collection_id)
        doc_ref.set(collection_obj.model_dump(), merge=True)
    except Exception as e:
        raise Exception(f"Failed to update document: {e}")