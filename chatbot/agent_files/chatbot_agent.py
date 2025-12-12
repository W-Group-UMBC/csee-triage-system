import os
import time
import firebase_admin
from datetime import datetime
from firebase_admin import credentials, firestore
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.knowledge import Knowledge  # Updated from Knowledge
from agno.vectordb.lancedb import LanceDb, SearchType
from agno.knowledge.embedder.openai import OpenAIEmbedder
from agno.db.sqlite import SqliteDb

from agent_files.chatbot_config import ChatbotConfig

os.makedirs(ChatbotConfig.DATA_DIR, exist_ok=True)

# firebase init
if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_CRED_PATH", "service_key.json")
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()

db = firestore.client()

# Knowledge Base init
# create the vector db instance
vector_db = LanceDb(
    table_name="firestore_knowledge",
    uri=os.path.join(ChatbotConfig.DATA_DIR, "lancedb"),
    search_type=SearchType.hybrid,
    embedder=OpenAIEmbedder(id="text-embedding-3-small"),
)

# create knowledge db
knowledge_base = Knowledge(
    vector_db=vector_db
)


# create agent when called
def get_agent(user_id: str = "default_user"):
    # UPDATED: Use SqliteDb for session storage
    db_path = os.path.join(ChatbotConfig.DATA_DIR, "agent_history.db")
    agent_db = SqliteDb(db_file=db_path)
    
    instructions = [
            "You are a helpful assistant for the CSEE Triage System.",
            "First, search the knowledge base for a direct answer to the user's question.",
            "If you CANNOT find a direct answer in the knowledge base, search the knowledge base for faculty members whose research interests or expertise relate to the user's topic.",
            "If you find related faculty, provide their names and relevant details as a helpful alternative.",
            "Do not fabricate information. If no faculty are relevant, simply state that you cannot find the answer."
        ]

    return Agent(
        model=OpenAIChat(id=f"{ChatbotConfig.OPENAI_MODEL}"),
        knowledge=knowledge_base,
        db=agent_db,
        read_chat_history=True, 
        session_id=user_id,
        instructions=instructions,
        markdown=True,
        search_knowledge=True,
    )

# sync firbase db and vector db
def drop_table():
    try:
        print("🗑️ Clearing existing knowledge base data...")
        
        # try high-level delete (vers dependent)
        if hasattr(vector_db, 'delete'):
            if (vector_db.delete()):
                print("✅ Knowledge base cleared")
                return

        # fallback to raw LanceDB client to drop the table
        elif hasattr(vector_db, 'table_name') and hasattr(vector_db, 'client'):
            print(f"Attempting to drop table: {vector_db.table_name}")
            try:
                vector_db.client.drop_table(vector_db.table_name)
            except Exception as inner_e:
                print(f"⚠️ specific drop_table failed: {inner_e}")
             
        print("✅ Knowledge base cleared.")
    except Exception as e:
        print(f"⚠️ Note: Could not clear table (normal for first run): {e}")
        return

async def sync_knowledge_base():
    print("⏳ Starting Firestore Sync...")

    start_time = time.time()

    print("Note this will cause the chatbot to be unable to answer questions until complete!")

    new_faqs = 0
    new_faculty_count = 0

    drop_table()

    try:
        print("Trying to sync FAQs")
        faqs = db.collection(f"{ChatbotConfig.FAQ_COLLECTION_N}").stream()
        
        if faqs:
            for q in faqs:
                data = q.to_dict()
                question = data.get("question", "")
                
                if question and data:

                    specific_metadata = {
                        "firestore_id": q.id,                   # Link back to firestore db
                        "type": "faq-database",                   # Static tag for this collection
                        "department": data.get("department", "N/A"), # Dynamic category
                        "year": datetime.now().year
                    }

                    await knowledge_base.add_content_async(
                        name=f"FAQ: {question}",
                        text_content=f"{data}",
                        metadata=specific_metadata,
                    )
                    new_faqs = new_faqs + 1
                
                    print(f"Added question: {question}")
            
        else:
            print("⚠️ FAQ Sync Complete: No documents found.")
        
        print(f"FAQ Sync Complete: Processed {new_faqs} documents.")
            
    except Exception as e:
        print(f"❌ Error during FAQ sync: {e}")

    try:
        print("Trying to sync Faculty")
        faculty = db.collection(f"{ChatbotConfig.FACULTY_COLLECTION_N}").stream()
        
        if faculty:
            for member in faculty:
                data = member.to_dict()
                m_name = data.get("name", "")
                m_email = data.get("email", "")
                
                if m_email and data:

                    specific_metadata = {
                        "firestore_id": member.id,                   
                        "type": "faculty-database",                  
                        "department": data.get("department", "N/A"),
                        "year": datetime.now().year
                    }

                    await knowledge_base.add_content_async(
                        name=f"Faculty Member: {m_email} (name: {m_name})",
                        text_content=f"{data}",
                        metadata=specific_metadata,
                    )
                    new_faculty_count = new_faculty_count + 1
                
                    print(f"Added faculty member: {m_email} (name: {m_name})")
                
        else:
            print("⚠️ Faculty Sync Complete: No documents found.")

        print(f"Faculty Sync Complete: Processed {new_faculty_count} documents.")
            
    except Exception as e:
        print(f"❌ Error during sync: {e}")

    try:
        print("Trying to sync web pages")
        pages = ChatbotConfig.UMBC_URLS_KNOWLEDGE
        
        
        for page in pages:
            p_name = data.get("name", "")
            p_url = data.get("url", "")
            p_subtype = data.get("subtype", "")

            
            if p_name and p_url:

                specific_metadata = {                 
                    "type": "csee-website",
                    "subtype": p_subtype,                  
                    "year": datetime.now().year
                }

                await knowledge_base.add_content_async(
                    name=f"Faculty Member: {m_email} (name: {m_name})",
                    text_content=f"{data}",
                    metadata=specific_metadata,
                )
                new_faculty_count = new_faculty_count + 1
            
                print(f"Added faculty member: {m_email} (name: {m_name})")
                
        else:
            print("⚠️ Faculty Sync Complete: No documents found.")

        print(f"Faculty Sync Complete: Processed {new_faculty_count} documents.")
            
    except Exception as e:
        print(f"❌ Error during sync: {e}")



    end_time = time.time()
    time_taken = end_time - start_time
    print(f"✅ Sync Complete: Processed {new_faqs + new_faculty_count} documents.")
    print(f"    Sync took {time_taken} seconds")