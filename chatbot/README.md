# Chatbot service for CMSC 447 CSEE Triage System

## Description

This folder contains the logic for the backend of the service for a chatbot. 

## Running

To run the service, complete the following:

1. Navigate to the chatbot directory
2. Add the Firebase key within a json file called `service_key.json`. The file should be in the `chatbot/` folder.
3. Add `.env` file that includes an OpenAI key and the number of hours to sync the database. It should look like:
```
OPENAI_API_KEY=sk-proj-your-actual-key-here
SYNC_INTERVAL_HOURS=6
```
4. For the first time and after any changes to the code, build the service using docker:
```
docker-compose up --build
```

To run after creating an image, you only need to do the command with build:
```
docker-compose up
```

The service should be running now. Checek the health using the curl request:
```
curl http://127.0.0.1:8001/health
```

## Endpoints

`/health` - returns healthy when service online
```
curl http://127.0.0.1:8001/health
```

`/chat` - returns a response to a message from AI Agent 
example:
```
curl -X POST http://127.0.0.1:8001/chat \
-H "Content-Type: application/json" \
-d '{"message": "a question here", "user_id": "test_user_docker"}'
```

`/admin/force-sync` - force the Firebase database and chatbot's database to sync
```
curl -X POST http://127.0.0.1:8001/admin/force-sync
```

## Issues
- lacks error handling