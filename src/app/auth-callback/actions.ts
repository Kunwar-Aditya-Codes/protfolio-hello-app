'use server';

import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

export const getAuthStatus = async () => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.email || !sessionUser.id) throw new Error('Not logged in!');

  const existingUser = await db.get(`user:${sessionUser.id}`);

  if (!existingUser) {
    const username = `${sessionUser.given_name} ${sessionUser.family_name}`;
    const createAvatarImage = createAvatar(initials, {
      seed: username,
    });
    const avatar = createAvatarImage.toDataUri();

    const setUserDetails = db.set(`user:${sessionUser.id}`, {
      username,
      email: sessionUser.email,
      id: sessionUser.id,
      profileImage: avatar,
    });
    const setUserEmail = db.set(
      `user:email:${sessionUser.email}`,
      sessionUser.id
    );
    await Promise.all([setUserDetails, setUserEmail]);
  }

  return { success: true };
};
