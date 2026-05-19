from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.recommendation.recommender import recommend_news

router = APIRouter(prefix="/recommend", tags=["recommend"])

@router.get("/")
def recommend(
    interest: str = Query(..., description="Your topic of interest"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = recommend_news(interest, db)
    return {"recommended_news": result, "user": current_user.username}
