
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.contenttypes.models import ContentType

from myapp.models import Group, Message, User,MessageReceiver

import json
print("consumer.py")
class Consumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        await self.accept()
        # 验证用户是否存在
        if not self.user_id:
            self.send(text_data=json.dumps({
                "status_code": 404,
                'message': 'User not found'
            }))
            await self.close()
            return
        
        # 验证用户
        try:
            self.user = await self.get_user(self.user_id)
            # 将用户添加到组
            await self.channel_layer.group_add(
                f'user_{self.user_id}',
                self.channel_name
            )
        except User.DoesNotExist:
            await self.send(text_data=json.dumps({
                "status_code": 404,
                'message': 'User not found'
            }))
            await self.close()
            return
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(f"user_{self.user_id}", self.channel_name)

    async def receive(self, text_data):
        
        data = json.loads(text_data)
        try:
            await self.send_message_to_user(data)
            await self.send(text_data=json.dumps({
                    'status_code': 201,
                    'message': 'Message sent'
                }))
        except Exception as e:
                await self.send(text_data=json.dumps({
                    'message': str(e)
                }))

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(UserID=user_id)

    @database_sync_to_async
    def save_message(self, data):
        channelType = data['channelType']
        content = data['content']
        receiver_id = data['receiverId']
        sender= User.objects.get(UserID=self.user_id)
        message = Message.objects.create(
            Sender=sender,
            Content=content
        )
        
        receiver_content_type = None
        
        if channelType=='PERSONAL':
            receiver= User.objects.get(UserID=receiver_id)
            receiver_content_type = ContentType.objects.get_for_model(receiver)
      
        if channelType=='GROUP':
            receiver= Group.objects.get(GroupID=receiver)
            receiver_content_type = ContentType.objects.get_for_model(receiver)
        
        MessageReceiver.objects.create(
                Message=message,
                receiver_content_type=receiver_content_type,
                receiver_object_id=receiver_id
            )
    
    async def receive_from_others(self, event):
        resp = event['message']
        await self.send(text_data=json.dumps(resp))
    
    
    async def send_message_to_user(self, data):

        receiver_id = data['receiverId']
        sender_id = int(self.user_id)
        # 保存消息
        await self.save_message(data)
        #添加发送者

        
        # 发送消息给指定用户
        receiver_channel_name = f"user_{receiver_id}"
        resp={
            'status_code': 200,
            'message': 'Message delivered',
            "data": {
                "content": data['content'],
                "senderId": sender_id,
                "receiverId": receiver_id,
                "channelType": data['channelType']
            }
        }
        
        # 如果用户在线，直接发送消息
        if receiver_channel_name in self.channel_layer.groups:
            await self.channel_layer.group_send(
                receiver_channel_name,
                {
                    'type': 'receive_from_others',
                    'message': resp
                }
            )
        
        else:
            # 如果用户不在线，存储消息，创建通知
            pass
        
        
### request format
# {
#     "channelType": "PERSONAL",
#     "content": "Hello",
#     "receiverId": 1
# }

### response format
# {
#    "status_code": 200,
#    "message": "Message sent"
#    "data"?: {
#     "content": "Hello",
#     "senderId": 1,
#     "receiverId": 1,
#     "channelType": "PERSONAL"
# }
# 

# }