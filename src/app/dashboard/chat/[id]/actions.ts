'use server';

import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { nanoid } from 'nanoid';

export const sendMessage = async ({
  text,
  chatId,
  chatImageUrl,
}: {
  text: string;
  chatId: string;
  chatImageUrl?: string;
}) => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.id || !sessionUser.email) throw new Error('Unauthorized!');

  const [userId1, userId2] = chatId.split('--');

  if (sessionUser.id !== userId1 && sessionUser.id !== userId2) {
    throw new Error('Unthorized chat access!');
  }

  const friendId = sessionUser.id === userId1 ? userId2 : userId1;

  const friendList = await db.smembers(`user:${sessionUser.id}:friends`);

  const isFriend = friendList.includes(friendId);
  if (!isFriend) throw new Error('You are not friends!');

  const sender = (await db.get(`user:${sessionUser.id}`)) as User;

  const timestamp = Date.now();

  const message: Message = {
    id: nanoid(),
    senderId: sessionUser.id,
    text,
    timestamp,
    chatImageUrl,
  };

  pusherServer.trigger(
    toPusherKey(`chat:${chatId}`),
    'incoming_message',
    message
  );

  pusherServer.trigger(
    toPusherKey(`user:${friendId}:chats`),
    'new_message',
    message
  );

  await db.zadd(`chat:${chatId}:messages`, {
    score: timestamp,
    member: message,
  });

  return { success: true };
};
