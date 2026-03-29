
from qdrant_client import QdrantClient
client = QdrantClient(location=":memory:")
print(f"Client type: {type(client)}")
print(f"Has search: {hasattr(client, 'search')}")
print(f"Has query_points: {hasattr(client, 'query_points')}")
print(f"Has query: {hasattr(client, 'query')}")
print("Non-private methods:")
for m in dir(client):
    if not m.startswith('_'):
        print(f" - {m}")
