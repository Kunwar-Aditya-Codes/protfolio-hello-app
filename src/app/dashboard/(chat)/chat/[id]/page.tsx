import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import MessageTopBar from '@/components/MessageTopBar';
import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getMessages(chatId: string) {
  const messages = (await db.zrange(
    `chat:${chatId}:messages`,
    0,
    -1
  )) as Message[];

  const reversedMessages = messages.reverse();

  return reversedMessages;
}

const Page = async ({ params }: { params: { id: string } }) => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.id || !sessionUser?.email) return notFound();

  const { id } = params;
  if (!id) return notFound();

  const [userId1, userId2] = id.split('--');
  if (sessionUser.id !== userId1 && sessionUser.id !== userId2) {
    notFound();
  }
  const chatPartnerId = sessionUser.id === userId1 ? userId2 : userId1;
  const [chatSessionUser, chatPartner] = (await Promise.all([
    await db.get(`user:${sessionUser.id}`),
    await db.get(`user:${chatPartnerId}`),
  ])) as [User, User];

  const initialMessages = await getMessages(id);

  return (
    <div className='h-full'>
      <div className='h-[4rem] border-b dark:border-b-zinc-900/40 dark:bg-zinc-950 drop-shadow-sm flex items-center justify-between px-6'>
        <MessageTopBar
          id={id}
          sessionUserId={sessionUser.id}
          chatPartner={chatPartner}
        />
        <div className='md:hidden'>
          <Link href={'/dashboard'}>
            <span className='underline underline-offset-1 text-sm text-zinc-700 dark:text-zinc-400'>
              Back
            </span>
          </Link>
        </div>
      </div>
      <div className='bg-zinc-100 dark:bg-zinc-950 h-full'>
        {/* Messages */}
        <Messages
          chatId={id}
          chatPartner={chatPartner}
          initialMessages={initialMessages}
          sessionUserId={sessionUser.id}
          chatSessionUser={chatSessionUser}
        />

        {/* Chat Input */}
        <ChatInput chatId={id} chatPartner={chatPartner} />
      </div>
    </div>
  );
};
export default Page;
