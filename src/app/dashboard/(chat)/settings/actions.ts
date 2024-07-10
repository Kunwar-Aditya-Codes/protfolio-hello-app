'use server';

import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const updateProfileImage = async ({
  profileImageUrl,
  user,
}: {
  profileImageUrl: string;
  user: User;
}) => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.id) throw new Error('Not logged in!');

  await db.set(`user:${user.id}`, {
    ...user,
    profileImage: profileImageUrl,
  });

  return { success: true };
};
