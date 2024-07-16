import ChatList from '@/components/ChatList';
import { db } from '@/lib/db';
import { chatHrefConstructor } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.id || !sessionUser.email) notFound();

  const friendIds = await db.smembers(`user:${sessionUser.id}:friends`);
  const friends = await Promise.all(
    friendIds.map(async (friend) => (await db.get(`user:${friend}`)) as User)
  );

  const friendWithLastMessage = (
    await Promise.all(
      friends.map(async (friend) => {
        const [lastMessage] = (await db.zrange(
          `chat:${chatHrefConstructor(sessionUser.id, friend.id)}:messages`,
          -1,
          -1
        )) as Message[];

        return lastMessage ? { ...friend, lastMessage } : null;
      })
    )
  ).filter(Boolean);

  const topChats = friendWithLastMessage.slice(0, 3);

  return (
    <div className='md:h-full'>
      {/* Mobile View */}
      <div className='md:hidden'>
        <div className=' p-6'>
          <h2 className='font-bold text-2xl tracking-tighter text-zinc-700 dark:text-zinc-300'>
            Messages
          </h2>
        </div>
        <div className='h-full '>
          <ChatList friendsList={friends} sessionUserId={sessionUser.id} />
        </div>
      </div>
      <div className='hidden md:block h-full p-10 md:p-36 bg-zinc-100 dark:bg-zinc-900 '>
        <h1 className='text-4xl font-semibold text-zinc-700 dark:text-zinc-300'>
          Recent Chats
        </h1>
        <div className='mt-8 max-w-5xl flex flex-col gap-y-4'>
          {topChats.length === 0 ? (
            <p className='dark:text-zinc-200'>No recent chats!</p>
          ) : (
            topChats.map((friend) => (
              <Link
                key={friend?.id}
                href={`/dashboard/chat/${chatHrefConstructor(
                  sessionUser.id,
                  friend?.id!
                )}`}
              >
                <div className='shadow-sm hover:shadow bg-white dark:bg-zinc-950 rounded-lg p-6 flex items-center justify-between'>
                  <div className='flex items-start gap-x-2'>
                    <div className=''>
                      <img
                        src={friend?.profileImage}
                        alt='profile-image'
                        className='w-10 rounded-full'
                      />
                    </div>
                    <div className='mt-1'>
                      <p className='text-xl font-medium text-zinc-800 dark:text-zinc-300'>
                        {friend?.username}
                      </p>
                      <p className='mt-2 text-zinc-500 font-medium'>
                        <span>
                          {friend?.lastMessage.senderId === sessionUser.id
                            ? 'You'
                            : friend?.username}
                          :
                        </span>
                        <span className='ml-1'>{friend?.lastMessage.text}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <ChevronRight className='size-6' />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Page;
