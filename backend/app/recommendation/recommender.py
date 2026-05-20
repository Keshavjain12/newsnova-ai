import math
from collections import Counter
from sqlalchemy.orm import Session
from app.models.news import News
from app.core.logger import logger


def _tokenize(text: str) -> list:
    return text.lower().split()


def _tfidf_vector(doc_tokens: list, all_docs_tokens: list) -> dict:
    tf = Counter(doc_tokens)
    total = len(doc_tokens) or 1
    num_docs = len(all_docs_tokens)
    vector = {}
    for word, count in tf.items():
        tf_score = count / total
        docs_with_word = sum(1 for d in all_docs_tokens if word in d)
        idf_score = math.log((num_docs + 1) / (docs_with_word + 1)) + 1
        vector[word] = tf_score * idf_score
    return vector


def _cosine_similarity(vec_a: dict, vec_b: dict) -> float:
    dot = sum(vec_a.get(w, 0) * vec_b.get(w, 0) for w in vec_b)
    norm_a = math.sqrt(sum(v ** 2 for v in vec_a.values())) or 1
    norm_b = math.sqrt(sum(v ** 2 for v in vec_b.values())) or 1
    return dot / (norm_a * norm_b)


def recommend_news(user_interest: str, db: Session, top_k: int = 5) -> list:
    articles = db.query(News).order_by(News.published_at.desc()).limit(200).all()
    if not articles:
        logger.warning("No articles in DB for recommendation")
        return []

    titles = [a.title for a in articles]
    all_tokens = [_tokenize(t) for t in titles]
    user_tokens = _tokenize(user_interest)

    user_vec = _tfidf_vector(user_tokens, all_tokens + [user_tokens])

    scored = []
    for i, tokens in enumerate(all_tokens):
        article_vec = _tfidf_vector(tokens, all_tokens + [user_tokens])
        score = _cosine_similarity(user_vec, article_vec)
        scored.append((i, score))

    scored.sort(key=lambda x: x[1], reverse=True)
    top = scored[:top_k]

    return [
        {
            "id": articles[i].id,
            "title": articles[i].title,
            "category": articles[i].category,
            "score": round(float(score), 4),
            "source_url": articles[i].source_url,
        }
        for i, score in top
    ]
