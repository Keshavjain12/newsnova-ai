from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.dependencies import get_db, get_current_user
from app.models.news import News
from app.models.user import User
from app.schemas.news import NewsOut

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/", response_model=List[NewsOut])
def get_news(
    category: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(News)
    if category:
        query = query.filter(News.category == category)
    return query.order_by(News.published_at.desc()).offset(offset).limit(limit).all()
