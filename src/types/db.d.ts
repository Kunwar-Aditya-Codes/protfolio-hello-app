interface User {
  username: string;
  email: string;
  id: string;
  profileImage: string;
}

interface Message {
  id: string;
  senderId: string;
  // receiverId: string;
  text: string;
  timestamp: number;
}

interface IncomingFriendRequest {
  senderId: string;
  senderEmail: string;
  senderName: string;
}
