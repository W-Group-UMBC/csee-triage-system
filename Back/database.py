import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("service_key.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firebase_admin.firestore.client()

faqs_ref = db.collection('faq')

def set_faq(doc_id: str, question: str, answer: str, faculty: str, tags: list):
    data = {
        'question': question,
        'answer': answer,
        'faculty': faculty,
        'tags': tags
    }

    faqs_ref.document(doc_id).set(data)

def get_faq(doc_id: str) -> dict | None:
    doc = faqs_ref.document(doc_id).get()
    return doc.to_dict() if doc.exists else None

def get_all_faqs() -> list[dict]:
    docs = faqs_ref.stream()
    return [doc.to_dict() for doc in docs]

def get_faqs_by_tag(tag: str) -> list[dict]:
    query = faqs_ref.where('tags', 'array_contains', tag)
    docs = query.stream()
    return [doc.to_dict() for doc in docs]

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
    print("FAQ added with auto ID.")

def delete_faq(doc_id: str):
    faqs_ref.document(doc_id).delete()