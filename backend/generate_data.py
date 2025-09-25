import json
import random
from datetime import datetime, timedelta
from uuid import uuid4
from pathlib import Path

# Sample assistant responses of varying lengths
ASSISTANT_RESPONSES = [
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
    "Hier ist ein detailliertes Beispiel: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "Verstehe ich das richtig?",
    "Das ist korrekt!",
    "Ich bin mir da nicht sicher. Lass mich das recherchieren.",
    "Perfekt! Das funktioniert definitiv.",
]

USER_MESSAGES = [
    "Hallo!",
    "Wie geht's?",
    "Kannst du mir mit einem Problem helfen?",
    "Was denkst du darüber?",
    "Das verstehe ich nicht.",
    "Kannst du das erklären?",
    "Danke!",
    "Das war hilfreich.",
    "Hmm, interessant.",
    "Ja, genau so!",
    "Ich habe eine Frage zum Frontend Development. Kannst du mir dabei helfen?",
    "Was ist der beste Weg, um React zu lernen?",
    "Nein, das ist nicht was ich meinte.",
    "Cool, danke für die Hilfe!",
    "Okay, verstanden.",
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
            f"Frontend Entwicklung Chat {i + 1}",
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
