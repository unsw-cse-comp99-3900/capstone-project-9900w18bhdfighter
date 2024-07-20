
from .utils import WSMsgRspDTO, is_sender_receiver_in_same_window, is_user_at_window
from ..serializers import GroupMessageSerializer, MessageSerializer
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from myapp.models import Group, GroupMessage, GroupUsersLink, Message, User
import json
curr_window = {}
class Msg:
    def __init__(self, sender_id, receiver_id, content):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.content = content
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
            res=WSMsgRspDTO(400,'Invalid user').to_json()
            await self.send(text_data=res)
            await self.close()
            return
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(f"user_{self.user_id}", self.channel_name)
        print("disconnect")
        global curr_window
        removed_user = curr_window.pop(int(self.user_id), None)
        if removed_user is not None:
            print(f"Removed user {self.user_id} from curr_window")
        else:
            print(f"User {self.user_id} was not found in curr_window")
        print(curr_window)
    
    # 服务器接收到消息传递给指定用户
    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        global curr_window
        print(curr_window)
        try:
            action=data.get('action')
            type=data.get('type')
            payload=data.get('payload',{})
            receiver_id=payload.get('receiverId')
            content=payload.get('content',None)
            sender_id=payload.get('senderId')
            window=data.get("currWindow")
            data=Msg(sender_id,receiver_id,content)
        except Exception as e:
            res=WSMsgRspDTO(400,f'Error: {str(e)}').to_json()
            await self.send(text_data=res)
            return
        if action =="CHANGE_WINDOW":
    
            if type=='user':
                curr_window[int(self.user_id)] = "user_"+str(window)
            # Set the user_id or other properties in the currWindow dict
            if type=='group':
                curr_window[int(self.user_id)] ="group_"+str(window)
            print(curr_window)
            return
        
        if action=="NEW_MESSAGE":
            if type=='user':
                try:
                    await self.send_message_to_user(data)
                except Exception as e:
                        res=WSMsgRspDTO(400,f'Error: {str(e)}').to_json()
                        await self.send(text_data=res)
            elif type=='group':
                try:
                    await self.send_message_to_group(data)
                except Exception as e:
                        res=WSMsgRspDTO(4020,f'Error: {str(e)}').to_json()
                        await self.send(text_data=res)
            return
        
        if action=="LEAVE":
            removed_user = curr_window.pop(int(self.user_id), None)
            if removed_user is not None:
                print(f"Removed user {self.user_id} from curr_window")
            else:
                print(f"User {self.user_id} was not found in curr_window")
            return
    
    # 如果收到来自其他用户的消息，发送给当前用户
    async def receive_from_others(self, event):
        resp = event['message']
        await self.send(text_data=json.dumps(resp))
        
    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(UserID=user_id)
    

    @database_sync_to_async
    def save_user_message(self, data:Msg,isRead):
        content = data.content
        receiver_id = data.receiver_id
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
        
    @database_sync_to_async
    def save_group_message(self, data:Msg,readBy):
        content = data.content
        receiver_id = data.receiver_id
        sender= User.objects.get(UserID=self.user_id)

        receiver=Group.objects.get(GroupID=receiver_id)
        msg=GroupMessage.objects.create(
            Content=content,
            Sender=sender,
            ReceiverGroup=receiver,
        )
        msg.ReadBy.set(readBy)
        serializer = GroupMessageSerializer(msg)
        return serializer.data


    @database_sync_to_async
    def get_group_members(self, group_id):
        group = Group.objects.get(GroupID=group_id)
        members=group.GroupMembers.all()
        

        return [member.UserID for member in members]  

   
    async def send_message_to_user(self, data:Msg):
        global curr_window
        receiver_id = data.receiver_id
        sender_id = int(self.user_id)
        
        # 发送消息给指定用户
        receiver_channel_name = f"user_{receiver_id}"
      

        # 如果用户在线，直接发送消息
        if receiver_channel_name in self.channel_layer.groups:
            print("用户在线")
            print(curr_window)
 
            if is_sender_receiver_in_same_window(sender_id, receiver_id,curr_window):
                print("用户在同一个房间")
                res=await self.save_user_message(data,isRead=True)
            else:
                res=await self.save_user_message(data,isRead=False)
 

            print(res)
            await self.channel_layer.group_send(
                receiver_channel_name,
                {
                    'type': 'receive_from_others',
                    'message': WSMsgRspDTO(200,'Message delivered',res,"user").to_dict()
                }
            )
        
        else:
            # 如果用户不在线，存储消息
            res=await self.save_user_message(data,isRead=False)
            print("用户不在线")
            #todo:创建通知


     
   
        # inform sender that the message has been sent
        _res=WSMsgRspDTO(200,'Message sent',res,"user").to_json()
        await self.send(text_data=_res)
        

    
    async def send_message_to_group(self, data:Msg):
        group_id = data.receiver_id
        sender_id = int(self.user_id)
        
        window_when_sent = curr_window.get(sender_id,-1)
        print(f"sender_id: {sender_id}")
        print(f"window_when_sent: {window_when_sent}")
        #找出组内所有用户
        members=await self.get_group_members(group_id)
        
        print(f"members: {members}")
        members.remove(sender_id)
        readBy=[sender_id]
        for member in members:
            receiver_channel_name = f"user_{member}"
            # 如果用户在线且在同一个房间，直接发送消息        
            if receiver_channel_name in self.channel_layer.groups:
                print("用户在线",member)
                #查找同一个房间的用户
                if is_user_at_window(window_when_sent,member,curr_window):
                    print("用户在同一个房间",member)
                    readBy.append(member)
            else:
                pass
        
        res=await self.save_group_message(data,readBy)

        for member in members:
            # 如果用户在线，直接发送消息
            receiver_channel_name = f"user_{member}"
            if receiver_channel_name in self.channel_layer.groups:
                await self.channel_layer.group_send(
                    receiver_channel_name,
                    {
                        'type': 'receive_from_others',
                        'message':WSMsgRspDTO(200,'Message delivered',res,"group").to_dict()
                    }
                )
        # inform sender that the message has been sent
        _res=WSMsgRspDTO(200,'Message sent',res,"group").to_json()
        await self.send(text_data=_res)
        
                        
        
        
        
    