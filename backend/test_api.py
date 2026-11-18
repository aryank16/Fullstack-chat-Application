#!/usr/bin/env python3
"""
Smoke tests for the Parley API.

Start the backend first:
    uv run uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
"""

import sys

import requests

BASE_URL = "http://localhost:8000"

passed = 0
failed = 0


def check(description, response, expected_status):
    global passed, failed
    ok = response.status_code == expected_status
    mark = "PASS" if ok else "FAIL"
    print(f"[{mark}] {description} -> {response.status_code}")
    if ok:
        passed += 1
    else:
        failed += 1
        print(f"       expected {expected_status}, body: {response.text[:200]}")
    return ok


def main():
    try:
        requests.get(f"{BASE_URL}/", timeout=3)
    except requests.ConnectionError:
        print(f"Backend is not reachable at {BASE_URL}. Start it first (see module docstring).")
        sys.exit(1)

    check("Health check", requests.get(f"{BASE_URL}/"), 200)
    check("List chats", requests.get(f"{BASE_URL}/chats"), 200)

    r = requests.get(f"{BASE_URL}/chats/paginated", params={"page": 1, "size": 5})
    if check("List chats (paginated)", r, 200):
        assert len(r.json()["items"]) <= 5

    # Create -> read -> rename -> message -> delete
    r = requests.post(f"{BASE_URL}/chats", params={"name": "Smoke test"})
    if not check("Create chat", r, 200):
        sys.exit(1)
    chat_id = r.json()["id"]

    check("Get chat", requests.get(f"{BASE_URL}/chats/{chat_id}"), 200)
    check(
        "Rename chat",
        requests.put(f"{BASE_URL}/chats/{chat_id}", json={"name": "Renamed"}),
        200,
    )

    r = requests.post(
        f"{BASE_URL}/chats/{chat_id}/stream", json={"content": "Hello from the smoke test"}
    )
    if check("Send message", r, 200):
        assert r.json()["type"] == "assistant"
        messages = requests.get(f"{BASE_URL}/chats/{chat_id}").json()["messages"]
        assert len(messages) == 2, "expected user + assistant message"

    check("Delete chat", requests.delete(f"{BASE_URL}/chats/{chat_id}"), 200)

    # Error cases
    check("Get missing chat", requests.get(f"{BASE_URL}/chats/does-not-exist"), 404)
    check("Delete missing chat", requests.delete(f"{BASE_URL}/chats/does-not-exist"), 404)

    print(f"\n{passed} passed, {failed} failed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
