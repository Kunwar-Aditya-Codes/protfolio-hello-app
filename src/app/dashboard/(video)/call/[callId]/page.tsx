import VideoCall from '@/components/VideoCall';
import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound } from 'next/navigation';

const Page = async ({ params }: { params: { callId: string } }) => {
  const { callId } = params;

  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.id || !sessionUser?.email) return notFound();

  const [userId1, userId2] = callId.split('--');
  if (sessionUser.id !== userId1 && sessionUser.id !== userId2) {
    notFound();
  }
  const chatPartnerId = sessionUser.id === userId1 ? userId2 : userId1;
  const [chatSessionUser, chatPartner] = (await Promise.all([
    await db.get(`user:${sessionUser.id}`),
    await db.get(`user:${chatPartnerId}`),
  ])) as [User, User];

  return (
    <div className='h-screen bg-zinc-950 text-white p-6'>
      <VideoCall you={chatSessionUser} partner={chatPartner} />
    </div>
  );
};
export default Page;
