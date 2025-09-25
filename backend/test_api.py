#!/usr/bin/env python3
"""
Test script for the Chat API
Demonstrates all available endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"


def test_endpoint(method, url, data=None, description=""):
    """Test an API endpoint and print results"""
    print(f"\n{'=' * 60}")
    print(f"Testing: {description}")
    print(f"{method} {url}")

    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)

        print(f"Status: {response.status_code}")

        if response.headers.get("content-type", "").startswith("application/json"):
            result = response.json()
            if isinstance(result, dict) and "items" in result:
                # Pagination response
                print(f"Total items: {result.get('total', 'N/A')}")
                print(f"Page: {result.get('page', 'N/A')}")
                print(f"Size: {result.get('size', 'N/A')}")
                print(f"Items in response: {len(result.get('items', []))}")
                if result.get("items"):
                    print(
                        f"First item: {json.dumps(result['items'][0], indent=2, default=str)[:200]}..."
                    )
            else:
                print(json.dumps(result, indent=2, default=str)[:500])
                if len(json.dumps(result, default=str)) > 500:
                    print("... (truncated)")
        else:
            print(response.text[:200])

        return response
    except Exception as e:
        print(f"ERROR: {e}")
        return None


def main():
    print("🚀 Chat API Test Suite")
    print(f"Testing API at: {BASE_URL}")

    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Server is running! Response: {response.json()}")
    except Exception:
        print("❌ Server is not running. Please start it with:")
        print("uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000")
        return

    # Test basic endpoints
    test_endpoint("GET", f"{BASE_URL}/", description="Root endpoint")
    test_endpoint("GET", f"{BASE_URL}/stats", description="API statistics")

    # Test chat list with pagination
    test_endpoint(
        "GET", f"{BASE_URL}/chats", description="Get all chats (default pagination)"
    )
    test_endpoint(
        "GET", f"{BASE_URL}/chats?page=1&size=5", description="Get first 5 chats"
    )
    test_endpoint(
        "GET", f"{BASE_URL}/chats?page=2&size=3", description="Get page 2 with 3 chats"
    )

    # Get a chat ID for further testing
    chat_response = requests.get(f"{BASE_URL}/chats?size=1")
    if chat_response.status_code == 200:
        first_chat = chat_response.json()["items"][0]
        chat_id = first_chat["id"]

        # Test individual chat endpoints
        test_endpoint(
            "GET", f"{BASE_URL}/chats/{chat_id}", description="Get specific chat"
        )
        test_endpoint(
            "GET",
            f"{BASE_URL}/chats/{chat_id}/messages",
            description="Get chat messages",
        )

        # Test sending a message
        message_data = {
            "content": "Hallo! Das ist eine Test-Message von dem API-Test-Skript."
        }
        response = test_endpoint(
            "POST",
            f"{BASE_URL}/chats/{chat_id}/messages",
            data=message_data,
            description="Send a message",
        )

        # Test message operations if we have a message
        if response and response.status_code == 200:
            assistant_message = response.json()
            message_id = assistant_message["id"]

            test_endpoint(
                "GET",
                f"{BASE_URL}/chats/{chat_id}/messages/{message_id}",
                description="Get specific message",
            )

            # Delete the message we just created
            test_endpoint(
                "DELETE",
                f"{BASE_URL}/chats/{chat_id}/messages/{message_id}",
                description="Delete message",
            )

    # Test chat CRUD operations
    create_response = test_endpoint(
        "POST", f"{BASE_URL}/chats?name=Test Chat API", description="Create new chat"
    )

    if create_response and create_response.status_code == 200:
        new_chat = create_response.json()
        new_chat_id = new_chat["id"]

        # Update chat name
        update_data = {"name": "Updated Test Chat Name"}
        test_endpoint(
            "PUT",
            f"{BASE_URL}/chats/{new_chat_id}",
            data=update_data,
            description="Update chat name",
        )

        # Send a message to the new chat
        test_endpoint(
            "POST",
            f"{BASE_URL}/chats/{new_chat_id}/messages",
            data={"content": "Test message in new chat"},
            description="Send message to new chat",
        )

        # Delete the test chat
        test_endpoint(
            "DELETE", f"{BASE_URL}/chats/{new_chat_id}", description="Delete test chat"
        )

    # Test error cases
    test_endpoint(
        "GET",
        f"{BASE_URL}/chats/nonexistent-id",
        description="Get non-existent chat (should return 404)",
    )

    print(f"\n{'=' * 60}")
    print("🎉 Test suite completed!")
    print(f"Visit {BASE_URL}/docs for interactive API documentation")


if __name__ == "__main__":
    main()
