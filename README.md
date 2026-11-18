# Parley

A full-stack chat application with authentication, a conversation sidebar, quick actions and streamed assistant replies.

- **Frontend:** React 19, TypeScript, TanStack Router, Tailwind CSS, Vite, and tests with Vitest + React Testing Library
- **Backend:** Python 3.12, FastAPI, Pydantic, and `fastapi-pagination`, managed with `uv`
- **Infra:** Docker and Docker Compose

## Features

- Sign up / log in. Chats are only available to authenticated users
- Create, switch between and delete conversations in the sidebar
- Quick-action prompts to start a conversation in one click
- Assistant responses delivered through a streaming endpoint
- Paginated chat listing API
- Unit tests for components, contexts and the API service layer

## Project structure

```
.
├── backend/
│   ├── src/
│   │   ├── main.py          # FastAPI app and routes
│   │   └── models.py        # Pydantic models
│   ├── generate_data.py     # Seeds sample chat data
│   └── test_api.py          # API smoke tests
├── frontend/
│   └── src/
│       ├── components/      # AuthForm, ChatWindow, ChatMessage, Sidebar, QuickActions, Layout
│       ├── contexts/        # AuthContext, ChatContext
│       ├── routes/          # TanStack Router routes
│       ├── services/api.ts  # Backend client
│       └── __tests__/       # Vitest suites
└── docker-compose.yaml
```

## API

| Method | Path                   | Description                           |
| ------ | ---------------------- | ------------------------------------- |
| GET    | `/chats`               | List all chats                        |
| GET    | `/chats/paginated`     | List chats with pagination            |
| GET    | `/chats/{id}`          | Get a single chat with its messages   |
| POST   | `/chats?name=...`      | Create a chat                         |
| PUT    | `/chats/{id}`          | Rename a chat                         |
| DELETE | `/chats/{id}`          | Delete a chat                         |
| POST   | `/chats/{id}/stream`   | Send a message and get the assistant reply |

Interactive docs are available at `http://127.0.0.1:8000/docs` when the backend is running.

## Getting started

### Backend

```bash
cd backend
uv sync
uv run python generate_data.py
uv run uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Docker

```bash
make run           # or: docker compose up --build
```

The frontend is served on port `3000` and the API on port `8000`.

## Testing

```bash
cd frontend
npm run test
```

```bash
cd backend
uv run --with requests python test_api.py   # requires the backend running on :8000
```

## Roadmap

- Replace the local-storage auth with a real auth service (JWT/OAuth)
- Persist chats in a database instead of in-memory storage
- Connect the assistant endpoint to an LLM
