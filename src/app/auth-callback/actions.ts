'use server';

import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const getAuthStatus = async () => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.email || !sessionUser.id) throw new Error('Not logged in!');

  const existingUser = await db.get(`user:${sessionUser.id}`);

  if (!existingUser) {
    await db.set(`user:${sessionUser.id}`, {
      username: `${sessionUser.given_name} ${sessionUser.family_name}`,
      email: sessionUser.email,
      id: sessionUser.id,
    });
  }

  return { success: true };
};
