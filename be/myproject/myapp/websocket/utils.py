

import json




def is_online(user_id,room_map):
    user_room=room_map.get(user_id,-1)
    if user_room!=-1:
        return True
    return False

def is_user_at_window(window_id,user_id,room_map):
    user_room=room_map.get(user_id,-1)
    if user_room==window_id:
        return True
    return False

def who_is_at_this_window(window_id,room_map):
    res=[]
    for user_id,room_id in room_map.items():
        if room_id==window_id:
            res.append(user_id)
    return res

def is_sender_receiver_in_same_window(sender,receiver,room_map):

    sender_key=f"user_{sender}"
    receiver_at=room_map.get(receiver,"")
    print(f"receiver_at: {receiver_at}")
    print(f"sender: {sender}")
    if receiver_at==sender_key:
        return True
    return False
class WSMsgRspDTO:
    def __init__(self,status_code,message,data=None,type=None):
        self.status_code=status_code
        self.message=message
        self.data=data
        self.type=type
    
    def to_json(self):
        
        res=json.dumps({
            'status_code': self.status_code,
            'message': self.message,
            "data":self.data,
            "type":self.type
        })
 
        return res
    def to_dict(self):
        return {
            'status_code': self.status_code,
            'message': self.message,
            "data":self.data,
            "type":self.type
        }
        