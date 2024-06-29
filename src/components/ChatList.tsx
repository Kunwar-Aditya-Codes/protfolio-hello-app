'use client';

import Link from 'next/link';
import { Separator } from './ui/separator';

const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.toUpperCase();
};

const ChatList = ({ friendsList }: { friendsList: User[] }) => {
  return (
    <div className='h-full '>
      {friendsList.map((friend) => (
        <Link href={`/dashboard/${friend.id}`}>
          <div key={friend.id} className='px-6 pt-4  hover:bg-zinc-100/60'>
            <div className='flex items-center space-x-3'>
              <div>
                <div className='text-lg w-11 h-11 flex bg-orange-600 ring-2 ring-orange-400 items-center justify-center rounded-full  text-white font-extrabold tracking-wider'>
                  {getInitials(friend.username)}
                </div>
              </div>
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
