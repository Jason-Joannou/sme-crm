from pydantic import BaseModel
from typing import Optional, List

class NewLead(BaseModel):
    id: Optional[str]
    business_meeting: str
    business_type: str
    contact_person: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    lattitude: Optional[str]
    longitude: Optional[str]
    last_contacted: Optional[str]
    outcome: Optional[str]
    notes: Optional[str]
