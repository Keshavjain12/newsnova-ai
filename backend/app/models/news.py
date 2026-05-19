from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database import Base

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    content = Column(Text)
    category = Column(String(100), index=True)
    sentiment = Column(String(20))
    source_url = Column(String(1000))
    image_url = Column(String(1000))
    published_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
