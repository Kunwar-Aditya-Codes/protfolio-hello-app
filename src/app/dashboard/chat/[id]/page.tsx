import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
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
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  const initialMessages = await getMessages(id);

  return (
    <div className='h-full flex flex-col'>
      <div className='bg-white h-[4rem] border-b drop-shadow-sm flex items-center gap-x-2.5 px-6'>
        <img
          src={chatPartner.profileImage}
          alt='profile-avatar'
          className='size-[2.5rem] rounded-full'
        />
        <div>
          <h1 className='text-base tracking-tight text-zinc-800 font-medium'>
            {chatPartner.username}
          </h1>
          <p className='text-xs font-medium text-muted-foreground'>
            {chatPartner.email}
          </p>
        </div>
      </div>
      <div className='grow bg-zinc-100 flex flex-col justify-between'>
        {/* Messages */}
        <div className='grow'>
          <Messages
            chatId={id}
            chatPartner={chatPartner}
            initialMessages={initialMessages}
            sessionUserId={sessionUser.id}
          />
        </div>

        {/* Chat Input */}
        <ChatInput chatId={id} chatPartner={chatPartner} />
      </div>
    </div>
  );
};
export default Page;
