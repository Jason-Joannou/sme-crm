from models.config import allowed_models
from firebase_admin import firestore

async def create_firebase_collection(db: firestore.client , collection_name: str, collection_id: str, collection_obj: allowed_models) -> str:
    try:
        doc_ref = db.collection(collection_name).document(collection_id)
        doc_ref.set(collection_obj.model_dump())
        return doc_ref.id
    except Exception as e:
        raise Exception(f"Failed to create document: {e}")
    
async def update_firebase_collection(db: firestore.client, collection_name: str, collection_id: str, collection_obj: allowed_models) -> None:
    try:
        doc_ref = db.collection(collection_name).document(collection_id)
        doc_ref.set(collection_obj.model_dump(), merge=True)
    except Exception as e:
        raise Exception(f"Failed to update document: {e}")
    
async def get_all_firebase_collections(db: firestore.client, collection_name: str) -> list[allowed_models]:
    try:
        docs = db.collection(collection_name).stream()
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        raise Exception(f"Failed to retrieve documents: {e}")