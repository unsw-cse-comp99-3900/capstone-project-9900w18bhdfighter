
from .utils import is_both_on_same_room,format_msg
from ..serializers import MessageSerializer
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from myapp.models import Group, Message, User

import json
curr_window = {}
class Consumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        
        # todo: token是否有效
        
        # 验证用户是否存在
        try:
            self.user_id = self.scope['url_route']['kwargs']['user_id']
            self.user = await self.get_user(self.user_id)
            # 将用户添加到组
            await self.channel_layer.group_add(
                f'user_{self.user_id}',
                self.channel_name
            )
        except Exception:
            res=format_msg(404,'User not found')
            await self.send(text_data=res)
            await self.close()
            return
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(f"user_{self.user_id}", self.channel_name)
        global curr_window
        curr_window.pop(int(self.user_id))
        print("disconnect")
        print(curr_window)
    
    # 服务器接收到消息传递给指定用户
    async def receive(self, text_data):
        print("receive")
        data = json.loads(text_data)
        if 'currWindow' in data:
            global curr_window
            # Set the user_id or other properties in the currWindow dict
            curr_window[int(self.user_id)] = int(data['currWindow'])
            return
        else:
            try:
                await self.send_message_to_user(data)
            except Exception as e:
                    res=format_msg(400,f'Error: {str(e)}')
                    await self.send(text_data=res)
   
    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(UserID=user_id)
    

    @database_sync_to_async
    def save_message(self, data,isRead):
        content = data['content']
        receiver_id = data['receiverId']
        sender= User.objects.get(UserID=self.user_id)
        isRead=isRead
        receiver=User.objects.get(UserID=receiver_id)
        msg=Message.objects.create(
            Content=content,
            Sender=sender,
            Receiver=receiver,
            IsRead=isRead
        )
        serializer = MessageSerializer(msg)
        return serializer.data
        
        
    # 如果收到来自其他用户的消息，发送给当前用户
    async def receive_from_others(self, event):
        resp = event['message']
        await self.send(text_data=json.dumps(resp))
    
    
    async def send_message_to_user(self, data):
        global curr_window
        receiver_id = data['receiverId']
        sender_id = int(self.user_id)

        # 发送消息给指定用户
        receiver_channel_name = f"user_{receiver_id}"
      

        # 如果用户在线，直接发送消息
        if receiver_channel_name in self.channel_layer.groups:
            print("用户在线")
            print(curr_window)
            # res=await self.save_message(data,isRead=False)
            if is_both_on_same_room(sender_id, receiver_id,curr_window):
                print("用户在同一个房间")
                res=await self.save_message(data,isRead=True)
            else:
                res=await self.save_message(data,isRead=False)
 
            await self.channel_layer.group_send(
                receiver_channel_name,
                {
                    'type': 'receive_from_others',
                    'message': {
                        'status_code': 200,
                        'message': 'Message delivered',
                        "data":res
                    }
                }
            )
        
        else:
            # 如果用户不在线，存储消息
            res=await self.save_message(data,isRead=False)
            print("用户不在线")
            #todo:创建通知

        
        _res=format_msg(201,'Message sent',res)
        # inform sender that the message has been sent
        await self.send(text_data=_res)
        
        
