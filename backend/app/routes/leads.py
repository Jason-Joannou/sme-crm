from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import JSONResponse, PlainTextResponse
from db.db_manager import DBManager
from db.crud import create_firebase_collection, get_all_firebase_collections
from models.leads import NewLead
from typing import List, Optional

router = APIRouter(
    prefix="/api/v1/leads", 
    tags=["leads"],
    responses={404: {"description": "Not Found"}})


@router.post("/create_lead")
async def create_lead(request: Request, lead: NewLead):
    try:
        db = DBManager().get_db()
        lead_id = create_firebase_collection(db=db, collection_name="leads", collection_id=lead.id, collection_obj=lead)
        return JSONResponse(status_code=200, content={"message": "Lead created successfully", "lead_id": lead_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/list_leads/", response_model=List[NewLead])
async def get_all_leads(business_type: Optional[str] = Query(None, description="Filter leads by business type")):
    try:
        db = DBManager().get_db()
        leads = get_all_firebase_collections(db=db, collection_name="leads")
        if business_type:
            leads = [lead for lead in leads if lead["business_type"] == business_type]
        return leads
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



