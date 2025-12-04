from pydantic import BaseModel

# pydantic schemas
class ChatRequest(BaseModel):
    message: str
    user_id: str

class ChatResponse(BaseModel):
    response: str
