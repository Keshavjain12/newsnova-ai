import feedparser
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.news import News
from app.core.logger import logger

RSS_FEEDS = {
    "technology": "https://feeds.bbci.co.uk/news/technology/rss.xml",
    "science": "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    "business": "https://feeds.bbci.co.uk/news/business/rss.xml",
    "sports": "https://feeds.bbci.co.uk/sport/rss.xml",
    "world": "https://feeds.bbci.co.uk/news/world/rss.xml",
}

def fetch_and_store_news(db: Session):
    for category, url in RSS_FEEDS.items():
        try:
            feed = feedparser.parse(url)
            added = 0
            for entry in feed.entries[:10]:
                exists = db.query(News).filter(News.source_url == entry.link).first()
                if not exists:
                    pub = None
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        pub = datetime(*entry.published_parsed[:6])
                    article = News(
                        title=entry.title,
                        content=entry.get("summary", ""),
                        category=category,
                        source_url=entry.link,
                        published_at=pub or datetime.utcnow(),
                    )
                    db.add(article)
                    added += 1
            db.commit()
            logger.info(f"Fetched {added} new articles for: {category}")
        except Exception as e:
            logger.error(f"Failed to fetch {category}: {e}")
            db.rollback()
