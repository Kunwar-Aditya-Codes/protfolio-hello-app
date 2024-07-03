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

  return (
    <div className='h-full p-6'>
      <h1 className='text-4xl font-semibold text-zinc-700'>Recent Chats</h1>
      <div className='mt-8 max-w-5xl'>
        {friendWithLastMessage.length === 0 ? (
          <p>No recent chats!</p>
        ) : (
          friendWithLastMessage.map((friend) => (
            <Link
              key={friend?.id}
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionUser.id,
                friend?.id!
              )}`}
            >
              <div className='hover:border rounded-lg shadow-md p-6 flex items-center justify-between'>
                <div className='flex items-start gap-x-2'>
                  <div className=''>
                    <img
                      src={friend?.profileImage}
                      alt='profile-image'
                      className='w-10 rounded-full'
                    />
                  </div>
                  <div className='mt-1'>
                    <p className='text-xl font-medium text-zinc-800'>
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
  );
};
export default Page;
