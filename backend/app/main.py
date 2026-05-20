from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user, news  # noqa
from app.api.v1.routes import auth, news as news_routes, recommend, chat
from app.core.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("NewsNova AI starting up...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ready.")
    yield
    logger.info("NewsNova AI shutting down.")

app = FastAPI(
    title="NewsNova AI",
    description="AI-powered news platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://newsnova-ai.netlify.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(news_routes.router, prefix="/api/v1")
app.include_router(recommend.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

@app.get("/health")
def health():
    return {"status": "ok", "service": "NewsNova AI"}
