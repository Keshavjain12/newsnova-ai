from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from app.models.news import News
from app.core.logger import logger


def recommend_news(user_interest: str, db: Session, top_k: int = 5) -> list:
    articles = db.query(News).order_by(News.published_at.desc()).limit(200).all()
    if not articles:
        logger.warning("No articles in DB for recommendation")
        return []

    titles = [a.title for a in articles]

    # Combine user interest with all titles so vectorizer sees the full vocabulary
    corpus = [user_interest] + titles

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(corpus)

    # First row is user interest, rest are articles
    user_vector = tfidf_matrix[0]
    article_vectors = tfidf_matrix[1:]

    similarity = cosine_similarity(user_vector, article_vectors)[0]
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