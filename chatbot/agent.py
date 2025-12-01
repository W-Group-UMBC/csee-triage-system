import os
import firebase_admin
from datetime import datetime
from firebase_admin import credentials, firestore
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.knowledge import Knowledge  # Updated from Knowledge
from agno.vectordb.lancedb import LanceDb, SearchType
from agno.knowledge.embedder.openai import OpenAIEmbedder
from agno.db.sqlite import SqliteDb

from chatbot_config import ChatbotConfig

# --- Configuration ---
os.makedirs(ChatbotConfig.DATA_DIR, exist_ok=True)

# 1. Initialize Firebase
if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_CRED_PATH", "service_key.json")
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()

db = firestore.client()

# 2. Knowledge Base Setup
# Create the vector database instance
vector_db = LanceDb(
    table_name="firestore_knowledge",
    uri=os.path.join(ChatbotConfig.DATA_DIR, "lancedb"),
    search_type=SearchType.hybrid,
    embedder=OpenAIEmbedder(id="text-embedding-3-small"),
)

# Create the Knowledge Base
knowledge_base = Knowledge(
    vector_db=vector_db
)


# 3. Agent Factory
def get_agent(user_id: str = "default_user"):
    # UPDATED: Use SqliteDb for session storage
    db_path = os.path.join(ChatbotConfig.DATA_DIR, "agent_history.db")
    agent_db = SqliteDb(db_file=db_path)
    
    return Agent(
        model=OpenAIChat(id=f"{ChatbotConfig.OPENAI_MODEL}"),
        knowledge=knowledge_base,
        db=agent_db,
        read_chat_history=True, 
        session_id=user_id,
        instructions=["You are a helpful assistant. Use the knowledge base to answer questions."],
        markdown=True,
        search_knowledge=True,
    )

# 4. Sync Logic
async def sync_knowledge_base():
    print("⏳ Starting Firestore Sync...")
    try:
        docs = db.collection(f"{ChatbotConfig.COLLECTION_NAME}").stream()
        
        new_documents_count = 0
        for doc in docs:
            data = doc.to_dict()
            question = data.get("question", "")
            
            if question and data:

                specific_metadata = {
                    "firestore_id": doc.id,                   # Link back to firestore db
                    "type": "faq",                   # Static tag for this collection
                    "department": data.get("department", "N/A"), # Dynamic category
                    "year": datetime.now().year
                }

                await knowledge_base.add_content_async(
                    name=f"FAQ: {question}",
                    text_content=f"{data}",
                    metadata=specific_metadata,
                )
                new_documents_count = new_documents_count + 1
            
            print(f"Added question: {question}")
            
        else:
            print("⚠️ Sync Complete: No documents found.")
        
        print(f"✅ Sync Complete: Processed {new_documents_count} documents.")
            
    except Exception as e:
        print(f"❌ Error during sync: {e}")