import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("wgroupcseetriagesystem-firebase-adminsdk-fbsvc-0facf1a50e.json")
firebase_admin.initialize_app(cred)

db = firebase_admin.firestore.client()