'use server';

import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { revalidatePath } from 'next/cache';

export const addFriendToChat = async ({ email }: { email: string }) => {
  // checking for logged in user
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.email || !sessionUser?.id)
    throw new Error('User not logged in!');

  // checking email validity
  const { email: emailToAdd } = addFriendValidator.parse({
    email,
  });

  // fetch id of person to add
  const idToAdd = await db.get(`user:email:${emailToAdd}`);
  if (!idToAdd) return { success: false, message: 'User does not exist!' };
  // check for not adding yourself
  if (idToAdd === sessionUser.id)
    return { success: false, message: 'Can not add yourself' };

  // check if request is sent
  const requestSent = await db.sismember(
    `user:${idToAdd}:incoming_friend_request`,
    sessionUser.id
  );
  if (requestSent) return { success: false, message: 'Request already sent!' };

  // check if user already friend
  const isAlreadyFriend = await db.sismember(
    `user:${sessionUser.id}:friends`,
    idToAdd
  );
  if (isAlreadyFriend) return { success: false, message: 'Already friends!' };

  pusherServer.trigger(
    toPusherKey(`user:${idToAdd}:incoming_friend_request`),
    'incoming_friend_request',
    {
      senderId: sessionUser.id,
      senderEmail: sessionUser.email,
      senderName: `${sessionUser.given_name} ${sessionUser.family_name}`,
    }
  );

  // send friend request
  await db.sadd(`user:${idToAdd}:incoming_friend_request`, sessionUser.id);

  revalidatePath('/dashboard', 'layout');

  return { success: true };
};

export const acceptFriendRequest = async ({ idToAdd }: { idToAdd: string }) => {
  // checking for logged in user
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.email || !sessionUser?.id)
    throw new Error('User not logged in!');

  // check if user already friend
  const isAlreadyFriend = await db.sismember(
    `user:${sessionUser.id}:friends`,
    idToAdd
  );

  if (isAlreadyFriend) return { success: false, message: 'Already friends!' };

  // check if there is actual incoming request
  const hasFriendRequest = await db.sismember(
    `user:${sessionUser.id}:incoming_friend_request`,
    idToAdd
  );
  if (!hasFriendRequest)
    return { success: false, message: 'No friend request!' };

  const [user, newFriend] = await Promise.all([
    await db.get(`user:${sessionUser.id}`),
    await db.get(`user:${idToAdd}`),
  ]);

  pusherServer.trigger(
    toPusherKey(`user:${sessionUser.id}:friends`),
    'new_friend',
    newFriend
  );

  pusherServer.trigger(
    toPusherKey(`user:${idToAdd}:friends`),
    'new_friend',
    user
  );

  await Promise.all([
    db.sadd(`user:${sessionUser.id}:friends`, idToAdd),
    db.sadd(`user:${idToAdd}:friends`, sessionUser.id),
    db.srem(`user:${sessionUser.id}:incoming_friend_request`, idToAdd),
  ]);

  revalidatePath('/dashboard', 'layout');

  return { success: true, senderId: idToAdd };
};

export const rejectFriendRequest = async ({
  idToDeny,
}: {
  idToDeny: string;
}) => {
  // checking for logged in user
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.email || !sessionUser?.id)
    throw new Error('User not logged in!');

  await db.srem(`user:${sessionUser.id}:incoming_friend_request`, idToDeny);

  pusherServer.trigger(
    toPusherKey(`user:${sessionUser.id}:reject`),
    'reject_friend',
    {}
  );

  revalidatePath('/dashboard', 'layout');

  return { success: true, senderId: idToDeny };
};
