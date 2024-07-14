

import json


def is_both_on_same_room(user1_id, user2_id,room_map):
    user1_room=room_map.get(user1_id,0)
    user2_room=room_map.get(user2_id,-1)
    
    if user1_room==user2_id and user2_room==user1_id:
        print(f'{user1_id} and {user2_id} are in the same room')
        return True
    return False

def is_online(user_id,room_map):
    user_room=room_map.get(user_id,-1)
    if user_room!=-1:
        return True
    return False


def format_msg(code,msg,data=None):
    if data is None:
        res = json.dumps({
        'status_code': code,
        'message': msg
    })
    else:
        res=json.dumps({
            'status_code': code,
            'message': msg,
            "data":data
        })
    
    return res