class UserMsgResponseDTO:
    def __init__(self, content,receiverId,senderId,isRead,createdAt,
                 messageId):
        self.content = content
        self.receiverId = receiverId
        self.senderId = senderId
        self.isRead = isRead
        self.createdAt = createdAt
        self.messageID = messageId
        
    def to_json(self):
        return {
            'content': self.content,
            'receiverId': self.receiverId,
            'senderId': self.senderId,
            'isRead': self.isRead,
            'createdAt': self.createdAt,
            'messageId': self.messageID
        }

    @staticmethod
    def from_json(json):
        return UserMsgResponseDTO(
            json['content'],
            json['receiverId'],
            json['senderId'],
            json['isRead'],
            json['createdAt'],
            json['messageId']
        )
        
class UserMsgRequestDTO:
    def __init__(self, content,receiverId,senderId):
        self.content = content
        self.receiverId = receiverId
        self.senderId = senderId
        
    def to_json(self):
        return {
            'content': self.content,
            'receiverId': self.receiverId,
            'senderId': self.senderId
        }

    @staticmethod
    def from_json(json):
        return UserMsgRequestDTO(
            json['content'],
            json['receiverId'],
            json['senderId']
        )