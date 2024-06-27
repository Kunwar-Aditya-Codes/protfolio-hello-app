'use server';

import { db } from '@/lib/db';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

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
  if (!idToAdd) throw new Error('Person does not exist!');
  // check for not adding yourself
  if (idToAdd === sessionUser.id) throw new Error("Can't add yourself!");

  // check if request is sent
  const requestSent = await db.sismember(
    `user:${idToAdd}:incoming_friend_request`,
    sessionUser.id
  );
  if (requestSent) throw new Error('Request already sent!');

  // check if user already friend
  const isAlreadyFriend = await db.sismember(
    `user:${sessionUser.id}:friends`,
    idToAdd
  );
  if (isAlreadyFriend) throw new Error('You are already friends!');

  // send friend request
  await db.sadd(`user:${idToAdd}:incoming_friend_request`, sessionUser.id);

  return { success: true };
};
