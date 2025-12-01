import os
from dotenv import load_dotenv
import uvicorn
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# Import from our agent module
from agent import get_agent, sync_knowledge_base
from chatbot_config import ChatbotConfig
from chatbot_schemas import ChatRequest, ChatResponse


# init stuff
load_dotenv()
scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Sync immediately and start scheduler
    print("🚀 Application starting...")
    
    # Run an initial sync (optional, can be disabled if startup time is critical)
    if ChatbotConfig.RUN_INIT_SYNC:
        await sync_knowledge_base()
    
    # Schedule the recurring task
    scheduler.add_job(sync_knowledge_base, 'interval', hours=ChatbotConfig.SYNC_INTERVAL_HOURS)
    scheduler.start()
    
    yield # Application runs here
    
    # Shutdown
    print("🛑 Application shutting down...")
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

# --- Endpoints ---
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        agent = get_agent(user_id=request.user_id)
        response = await agent.arun(request.message)
        return ChatResponse(response=response.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/force-sync")
async def force_sync():
    """Endpoint to manually trigger sync (useful for debugging)"""
    await sync_knowledge_base()
    return {"status": "Sync triggered successfully"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False)