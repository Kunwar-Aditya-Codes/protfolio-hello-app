'use client';

import Link from 'next/link';
import { Separator } from './ui/separator';
import { chatHrefConstructor } from '@/lib/utils';

const ChatList = ({
  friendsList,
  sessionUserId,
}: {
  friendsList: User[];
  sessionUserId: string;
}) => {
  return (
    <div className='h-full '>
      {friendsList.map((friend) => (
        <Link
          href={`/dashboard/chat/${chatHrefConstructor(
            sessionUserId,
            friend.id
          )}`}
          key={friend.id}
        >
          <div className='px-6 pt-4  hover:bg-zinc-100/60'>
            <div className='flex items-center space-x-2.5'>
              <img
                src={friend.profileImage}
                alt='profile-image'
                className='size-[2.7rem] rounded-full'
              />
              <div className='w-full'>
                <p className='font-bold text-lg text-zinc-600'>
                  {friend.username}
                </p>
              </div>
            </div>
            <Separator className='mt-3 border-zinc-100 border' />
          </div>
        </Link>
      ))}
    </div>
  );
};
export default ChatList;
