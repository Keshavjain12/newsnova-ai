from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from app.models.news import News
from app.core.logger import logger

model = SentenceTransformer("all-MiniLM-L6-v2")

def recommend_news(user_interest: str, db: Session, top_k: int = 5) -> list:
    articles = db.query(News).order_by(News.published_at.desc()).limit(200).all()
    if not articles:
        logger.warning("No articles in DB for recommendation")
        return []
    titles = [a.title for a in articles]
    article_embeddings = model.encode(titles)
    user_embedding = model.encode([user_interest])
    similarity = cosine_similarity(user_embedding, article_embeddings)[0]
    top_indices = similarity.argsort()[-top_k:][::-1]
    return [
        {
            "id": articles[i].id,
            "title": articles[i].title,
            "category": articles[i].category,
            "score": round(float(similarity[i]), 4),
            "source_url": articles[i].source_url,
        }
        for i in top_indices
    ]
