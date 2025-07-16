import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    logger.info("API starting up")
    yield
    # Shutdown code
    logger.info("API shutting down")


app = FastAPI(
    title="SME CRM API",
    description="API service for SME Customer Relationship Management",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Root Endpoint
@app.get("/")
async def root():
    content = {
        "message": "SME CRM API",
        "documentation": "/docs",
    }

    return JSONResponse(status_code=200, content=content)

@app.get("/health")
async def health():
    return JSONResponse(status_code=200, content={"message": "Healthy"})

if __name__ == "__main__":
    import uvicorn
    import os

    logger.info("Starting API server")
    uvicorn.run("app:app", host="127.0.0.1", port=3000, reload=True)

    # port = int(os.environ.get("PORT", 3000))
    # uvicorn.run("api.app:app", host="0.0.0.0", port=port, reload=True)