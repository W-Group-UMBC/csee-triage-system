import os


class ChatbotConfig:
    """Configuration class for constants for the chatbot service"""

    # Sync knowloedge base on chatbot startup (0 = DO NOT SYNC)
    RUN_INIT_SYNC = int(os.getenv("RUN_INIT_SYNC", 0))

    DATA_DIR = os.getenv("DATA_DIR", "./data")

    SYNC_INTERVAL_HOURS = int(os.getenv("SYNC_INTERVAL_HOURS", 1))
    
    COLLECTION_NAME = "faq"

    OPENAI_MODEL = "gpt-4o-mini"