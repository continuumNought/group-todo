from channels.generic.websocket import AsyncWebsocketConsumer
import json


class TodoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("todos", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("todos", self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            await self.channel_layer.group_send(
                "todos",
                {"type": "todo.message", "text": text_data},
            )

    async def todo_message(self, event):
        await self.send(text_data=json.dumps({"message": event["text"]}))
