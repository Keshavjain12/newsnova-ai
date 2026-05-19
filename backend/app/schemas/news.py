from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NewsOut(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    category: Optional[str] = None
    sentiment: Optional[str] = None
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True
