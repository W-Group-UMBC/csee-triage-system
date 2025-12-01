from pydantic import BaseModel
from typing import List

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

import firebase_admin
from firebase_admin import credentials, auth, firestore

import uvicorn

# Functions from database.py
from database import *

# Getting Secrets
cred = credentials.Certificate("wgroupcseetriagesystem-firebase-adminsdk-fbsvc-162d973a3d.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# FastAPI app initialization
app = FastAPI()

# Firestore client
db = firestore.client()
faqs_ref = db.collection('faq')

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

allowed_users = {}
# Get allowed users from Firestore
def get_allowed_users():
    users_ref = db.collection('faculty')
    docs = users_ref.stream()
    return set(doc.id for doc in docs)

# Verify token dependency
async def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    id_token = auth_header.split(" ")[1]

    try:
        decoded_token = auth.verify_id_token(id_token)
        email = decoded_token.get("email")

        allowed_users = get_allowed_users()

        if email not in allowed_users:
            raise HTTPException(status_code=403, detail="Access denied: not an approved user.")
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    
# Protected route example
@app.get("/secure-data")
async def secure_data(user=Depends(verify_token)):
    email = user.get("email")
    # Return JSON instead of redirect
    return {"authorized": True, "email": email}


@app.get("/check-access")
async def check_access(user=Depends(verify_token)):
    # user is decoded token from Firebase
    return {"authorized": True, "email": user["email"]}


# --- Request models ---
class FAQCreate(BaseModel):
    question: str
    answer: str
    faculty: str
    tags: List[str]
    index: int | None = None

# --- Routes ---
@app.post("/faq/add")
async def api_add_faq(faq: FAQCreate, user=Depends(verify_token)):
    add_faq(faq.question, faq.answer, faq.faculty, faq.tags, faq.index)
    return {"message": "FAQ added successfully"}

@app.get("/public/faq/{doc_id}")
async def api_get_faq(doc_id: str):
    faq = get_faq(doc_id)
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return faq

@app.get("/public/faqs")
async def api_get_all_faqs():
    return get_all_faqs()

@app.get("/public/faqs/tag/{tag}")
async def api_get_faqs_by_tag(tag: str):
    return get_faqs_by_tag(tag)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)