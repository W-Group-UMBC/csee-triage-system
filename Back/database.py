import firebase_admin
import logging
from firebase_admin import credentials
from firebase_admin import firestore

logger = logging.getLogger(__name__)
# Initialize only if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate("service_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()
faqs_ref = db.collection('faq')

def get_faq(doc_id: str) -> dict | None:
    doc = faqs_ref.document(doc_id).get()
    if doc.exists:
        data = doc.to_dict()
        data['id'] = doc.id # Ensure ID is included
        return data
    return None

def get_all_faqs() -> list[dict]:
    docs = faqs_ref.stream()
    result = []
    for doc in docs:
        data = doc.to_dict()
        data['id'] = doc.id # Critical: Frontend needs this ID to delete items
        result.append(data)
    return result

def get_faqs_by_tag(tag: str) -> list[dict]:
    query = faqs_ref.where('tags', 'array_contains', tag)
    docs = query.stream()
    result = []
    for doc in docs:
        data = doc.to_dict()
        data['id'] = doc.id
        result.append(data)
    return result

def add_faq(question: str, answer: str, faculty: str, tags: list, index = None):
    data = {
        'question': question,
        'answer': answer,
        'faculty': faculty,
        'tags': tags
    }
    if index is not None:
        data['index'] = index

    db.collection('faq').add(data)
    logging.info("FAQ added with auto ID.")

def update_faq(doc_id: str, question: str, answer: str, faculty: str, tags: list):
    data = {
        'question': question,
        'answer': answer,
        'faculty': faculty,
        'tags': tags
    }
    faqs_ref.document(doc_id).update(data)
    logger.info(f"FAQ {doc_id} updated.")

def delete_faq(doc_id: str):
    faqs_ref.document(doc_id).delete()
    logger.info(f"FAQ {doc_id} deleted.")