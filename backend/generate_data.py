import json
import random
from datetime import datetime, timedelta
from uuid import uuid4
from pathlib import Path

# Sample assistant responses of varying lengths
ASSISTANT_RESPONSES = [
    "Hi! How can I help you?",
    "That's an interesting question. Let me think about it...",
    "Sorry, I'm not sure I follow. Could you explain that again?",
    "Yes!",
    "No.",
    "Happy to explain. There are a few things to keep in mind...",
    "Hmm, that's a complex one. Want me to walk through it step by step?",
    "Great idea!",
    "That sounds like an exciting project. Here are my thoughts:",
    "Short answer: it depends.",
    "Here's a detailed example: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "Did I understand that correctly?",
    "That's correct!",
    "I'm not sure about that. Let me look into it.",
    "Perfect! That will definitely work.",
]

USER_MESSAGES = [
    "Hello!",
    "How's it going?",
    "Can you help me with a problem?",
    "What do you think about this?",
    "I don't understand that.",
    "Can you explain that?",
    "Thanks!",
    "That was helpful.",
    "Hmm, interesting.",
    "Yes, exactly!",
    "I have a question about frontend development. Can you help?",
    "What's the best way to learn React?",
    "No, that's not what I meant.",
    "Cool, thanks for the help!",
    "Okay, got it.",
]


def generate_chat_messages(num_messages=None):
    if num_messages is None:
        num_messages = random.randint(1, 15)

    messages = []
    base_time = datetime.now() - timedelta(days=random.randint(1, 30))

    for i in range(num_messages):
        # Alternate between user and assistant, starting with user
        message_type = "user" if i % 2 == 0 else "assistant"

        if message_type == "user":
            content = random.choice(USER_MESSAGES)
        else:
            content = random.choice(ASSISTANT_RESPONSES)

        timestamp = base_time + timedelta(minutes=i * random.randint(1, 10))

        message = {
            "id": str(uuid4()),
            "type": message_type,
            "content": content,
            "timestamp": timestamp.isoformat(),
        }
        messages.append(message)

    return messages


def generate_chats(num_chats=1000):
    chats = []

    for i in range(num_chats):
        chat_id = str(uuid4())
        created_at = datetime.now() - timedelta(days=random.randint(1, 365))
        updated_at = created_at + timedelta(hours=random.randint(1, 24))

        # Generate varied chat names
        chat_names = [
            f"Chat {i + 1}",
            f"Frontend Development {i + 1}",
            f"React Help Session {i + 1}",
            f"Debug Session {i + 1}",
            f"API Integration Chat {i + 1}",
            f"UI/UX Discussion {i + 1}",
            f"Code Review Chat {i + 1}",
            f"Quick Question {i + 1}",
            f"Project Planning {i + 1}",
            f"Tech Support {i + 1}",
        ]

        chat = {
            "id": chat_id,
            "name": random.choice(chat_names),
            "messages": generate_chat_messages(),
            "created_at": created_at.isoformat(),
            "updated_at": updated_at.isoformat(),
        }
        chats.append(chat)

    return chats


if __name__ == "__main__":
    chats = generate_chats(1000)
    data_dir = Path(__file__).parent / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    with data_dir.joinpath("chats.json").open("w", encoding="utf-8") as f:
        json.dump(chats, f, ensure_ascii=False, indent=2)

    print(f"Generated {len(chats)} chats and saved to data/chats.json")
