from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime


class ChatMessage(BaseModel):
    id: str
    type: Literal["assistant", "user"]
    content: str
    timestamp: datetime


class Chat(BaseModel):
    id: str
    name: str
    messages: List[ChatMessage]
    created_at: datetime
    updated_at: datetime


class SendMessageRequest(BaseModel):
    content: str


class UpdateChatRequest(BaseModel):
    name: str
