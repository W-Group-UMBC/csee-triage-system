import os


class ChatbotConfig:
    """Configuration class for constants for the chatbot service"""

    # Sync knowloedge base on chatbot startup (0 = DO NOT SYNC)
    RUN_INIT_SYNC = int(os.getenv("RUN_INIT_SYNC", 0))

    DATA_DIR = os.getenv("DATA_DIR", "./data")

    SYNC_INTERVAL_HOURS = int(os.getenv("SYNC_INTERVAL_HOURS", 1))
    
    FAQ_COLLECTION_N = "faq"
    FACULTY_COLLECTION_N = "faculty"

    OPENAI_MODEL = "gpt-4o-mini"

    # static urls, change in future?
    UMBC_URLS_KNOWLEDGE = [
        {"name": "CSEE Leadership", "subtype": "csee staff", "url": "https://www.csee.umbc.edu/leadership/"},
        {"name": "Tenure-track Faculty", "type": "", "csee staff": "https://www.csee.umbc.edu/tenure-track-faculty/"},
        {"name": "placeholder", "type": "", "url": "placeholder"},
        {"name": "placeholder", "type": "", "url": "placeholder"},
        {"name": "placeholder", "type": "", "url": "placeholder"}
    ]