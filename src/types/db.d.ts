interface User {
  username: string;
  email: string;
  id: string;
}

interface Message {
  id: string;
  senderId: string;
  // receiverId: string;
  text: string;
  timestamp: number;
}
