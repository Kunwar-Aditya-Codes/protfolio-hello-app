import AddFriend from '@/components/AddFriend';
import FriendRequest from '@/components/FriendRequest';
import { cn } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowLeftFromLine } from 'lucide-react';
import { Pacifico } from 'next/font/google';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const pacifico = Pacifico({ subsets: ['latin'], weight: ['400'] });

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();

  if (!sessionUser?.id || !sessionUser?.email) notFound();

  return (
    <div className='flex h-screen bg-slate-50'>
      {/* Sidebar */}
      <div className='flex-[0.05] flex flex-col shadow-xl bg-white'>
        <div className='flex items-center justify-center p-3'>
          <h1
            className={cn(
              'bg-orange-500 text-white rounded-full w-[3.5rem] h-[3.5rem] flex items-center justify-center text-3xl font-black ',
              pacifico.className
            )}
          >
            h
          </h1>
        </div>

        <div className='grow flex flex-col gap-y-8 items-center mt-8'>
          <AddFriend />
          {/* Add friend notification */}
          <FriendRequest />
          
        </div>

        <div className='flex items-center justify-center p-4'>
          <Link
            href={'/api/auth/logout'}
            className='hover:bg-zinc-100 hover:shadow rounded-lg p-3'
          >
            <ArrowLeftFromLine className='size-5 text-zinc-600  ' />
          </Link>
        </div>
      </div>
      {/* Chats */}
      <div className='flex-[0.225] h-full border-r'>
        <div className='border-b p-6'>
          <h2 className='font-bold text-2xl tracking-tighter text-zinc-700'>
            Messages
          </h2>
        </div>
        <div></div>
      </div>

      {/* Messsage */}
      <div className='flex-[0.725]'></div>
    </div>
  );
};
export default DashboardLayout;
