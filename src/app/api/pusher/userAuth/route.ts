import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const POST = async (req: Request) => {
  const data = await req.text();
  const [socketId, channelName] = data
    .split('&')
    .map((str) => str.split('=')[1]);

  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.id) return new Response('Not logged in!', { status: 404 });

  const user = (await db.get(`user:${sessionUser.id}`)) as User;

  const presenceData = {
    id: user.id,
    user_info: {
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    },
  };

  const auth = pusherServer.authenticateUser(socketId, presenceData);

  return new Response(JSON.stringify(auth));
};
