from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import Page, paginate, add_pagination
from fastapi_pagination.utils import disable_installed_extensions_check
import json

from datetime import datetime
from uuid import uuid4
from typing import List, Dict

from .models import Chat, ChatMessage, SendMessageRequest, UpdateChatRequest

disable_installed_extensions_check()

app = FastAPI(
    title="Chat API", description="Mock API for Frontend Development", version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chats_data: Dict[str, Chat] = {}

MOCK_ASSISTANT_RESPONSES = [
    "Hi! Wie kann ich dir helfen?",
    "Das ist eine interessante Frage. Lass mich darüber nachdenken...",
    "Entschuldigung, ich verstehe das nicht ganz. Könntest du das nochmal erklären?",
    "Ja!",
    "Nein.",
    "Das kann ich dir gerne erklären. Es gibt mehrere Aspekte zu beachten...",
    "Hmm, das ist komplex. Möchtest du, dass ich es Schritt für Schritt erkläre?",
    "Gute Idee!",
    "Das hört sich nach einem spannenden Projekt an. Hier sind meine Gedanken dazu:",
    "Kurz gesagt: Es kommt darauf an.",
]


def load_chats_from_json():
    """Load chats from JSON file into memory"""
    global chats_data
    try:
        with open("data/chats.json", "r", encoding="utf-8") as f:
            chats_list = json.load(f)

        for chat_data in chats_list:
            # Convert to Pydantic models
            messages = [ChatMessage(**msg) for msg in chat_data["messages"]]
            chat = Chat(
                id=chat_data["id"],
                name=chat_data["name"],
                messages=messages,
                created_at=datetime.fromisoformat(chat_data["created_at"]),
                updated_at=datetime.fromisoformat(chat_data["updated_at"]),
            )
            chats_data[chat.id] = chat

        print(f"Loaded {len(chats_data)} chats from JSON")
    except Exception as e:
        print(f"Error loading chats: {e}")
        chats_data = {}


def save_chats_to_json():
    """Save chats from memory to JSON file"""
    try:
        chats_list = []
        for chat in chats_data.values():
            chat_dict = {
                "id": chat.id,
                "name": chat.name,
                "messages": [
                    {
                        "id": msg.id,
                        "type": msg.type,
                        "content": msg.content,
                        "timestamp": msg.timestamp.isoformat()
                    }
                    for msg in chat.messages
                ],
                "created_at": chat.created_at.isoformat(),
                "updated_at": chat.updated_at.isoformat()
            }
            chats_list.append(chat_dict)
        
        with open("data/chats.json", "w", encoding="utf-8") as f:
            json.dump(chats_list, f, indent=2, ensure_ascii=False)
        
        print(f"Saved {len(chats_data)} chats to JSON")
    except Exception as e:
        print(f"Error saving chats: {e}")


@app.on_event("startup")
async def startup_event():
    """Load data on application startup"""
    load_chats_from_json()


@app.get("/")
async def root():
    return {"message": "Chat API is running", "total_chats": len(chats_data)}


@app.get("/chats", response_model=List[Chat])
async def get_chats():
    """Get full list of chats"""
    chats_list = list(chats_data.values())
    chats_list.sort(key=lambda x: x.updated_at, reverse=True)
    return chats_list


@app.get("/chats/paginated", response_model=Page[Chat])
async def get_chats_paginated():
    """Get paginated list of chats"""
    chats_list = list(chats_data.values())
    chats_list.sort(key=lambda x: x.updated_at, reverse=True)
    return paginate(chats_list)


@app.get("/chats/{chat_id}", response_model=Chat)
async def get_chat(chat_id: str):
    """Get a specific chat by ID"""
    if chat_id not in chats_data:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chats_data[chat_id]


@app.post("/chats/{chat_id}/stream", response_model=ChatMessage)
async def send_message(chat_id: str, request: SendMessageRequest):
    """Send a message to a chat and get assistant response"""
    if chat_id not in chats_data:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats_data[chat_id]
    
    # Add user message
    user_message = ChatMessage(
        id=f"user-{uuid4()}",
        type="user",
        content=request.content,
        timestamp=datetime.now()
    )
    
    # Add assistant response
    import random
    assistant_message = ChatMessage(
        id=f"assistant-{uuid4()}",
        type="assistant",
        content=random.choice(MOCK_ASSISTANT_RESPONSES),
        timestamp=datetime.now()
    )
    
    # Add both messages to the chat
    chat.messages.extend([user_message, assistant_message])
    chat.updated_at = datetime.now()
    
    # Save updated chat back to JSON
    save_chats_to_json()
    
    return assistant_message


@app.post("/chats", response_model=Chat)
async def create_chat(name: str = "New Chat"):
    """Create a new chat"""
    new_chat = Chat(
        id=str(uuid4()),
        name=name,
        messages=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    chats_data[new_chat.id] = new_chat
    save_chats_to_json()
    return new_chat


@app.put("/chats/{chat_id}", response_model=Chat)
async def update_chat(chat_id: str, request: UpdateChatRequest):
    """Update chat name"""
    if chat_id not in chats_data:
        raise HTTPException(status_code=404, detail="Chat not found")

    chat = chats_data[chat_id]
    chat.name = request.name
    chat.updated_at = datetime.now()
    save_chats_to_json()

    return chat


@app.delete("/chats/{chat_id}")
async def delete_chat(chat_id: str):
    """Delete a chat"""
    if chat_id not in chats_data:
        raise HTTPException(status_code=404, detail="Chat not found")

    del chats_data[chat_id]
    save_chats_to_json()
    return {"message": "Chat deleted successfully"}


add_pagination(app)
