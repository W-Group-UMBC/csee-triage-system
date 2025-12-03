import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# import agent stuff
from agent_files.chatbot_agent import get_agent, sync_knowledge_base
from agent_files.chatbot_config import ChatbotConfig
from agent_files.chatbot_schemas import ChatRequest, ChatResponse


# init stuff
load_dotenv()
scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: Sync immediately and start scheduler
    print("🚀 Application starting...")
    
    # init sync if enabled (always 1 for docker startup)
    if ChatbotConfig.RUN_INIT_SYNC:
        await sync_knowledge_base()
    
    # schedule the recurring sync task
    scheduler.add_job(sync_knowledge_base, 'interval', hours=ChatbotConfig.SYNC_INTERVAL_HOURS)
    scheduler.start()
    
    yield 
    
    # shutdown
    print("🛑 Application shutting down...")
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # change to frontend url in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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