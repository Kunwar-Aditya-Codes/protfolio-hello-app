import AddFriend from '@/components/AddFriend';
import ChatList from '@/components/ChatList';
import FriendRequest from '@/components/FriendRequest';
import MobileNavigation from '@/components/MobileNavigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { DialogTrigger } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowLeftFromLine, Settings } from 'lucide-react';
import { Pacifico } from 'next/font/google';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const pacifico = Pacifico({ subsets: ['latin'], weight: ['400'] });

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();

  if (!sessionUser?.id || !sessionUser?.email) notFound();

  const friendListIds = await db.smembers(`user:${sessionUser.id}:friends`);

  const friendsList = await Promise.all(
    friendListIds.map(async (friend) => {
      const userFriend = (await db.get(`user:${friend}`)) as User;
      return {
        ...userFriend,
      };
    })
  );

  return (
    <div className='relative flex h-[100dvh] bg-zinc-50 dark:bg-zinc-950  overflow-hidden'>
      {/* Sidebar */}
      <MobileNavigation />
      <>
        <div className='hidden flex-0 md:flex-[0.05] md:flex flex-col border-r-2 border-zinc-100 dark:border-zinc-900/30'>
          <div className='flex items-center justify-center p-3'>
            <Link href={'/dashboard'}>
              <h1
                className={cn(
                  'bg-orange-500 text-white rounded-full w-[3.25rem] h-[3.25rem] flex items-center justify-center text-2xl font-black ',
                  pacifico.className
                )}
              >
                h
              </h1>
            </Link>
          </div>

          <div className='grow flex flex-col gap-y-12 items-center mt-8'>
            <AddFriend />
            <FriendRequest />
            <Link href={'/dashboard/settings'}>
              <Settings className='size-6 md:size-7 text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-400' />
            </Link>
          </div>

          <div className='flex flex-col gap-y-6 items-center justify-center p-4'>
            <ThemeSwitcher />

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={'/api/auth/logout'}
                    className='hover:bg-zinc-100 hover:shadow dark:hover:bg-zinc-800  rounded-lg p-3'
                  >
                    <ArrowLeftFromLine className='size-5 text-zinc-600 dark:text-zinc-300  ' />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side={'right'}>
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </>
      {/* Chats */}
      <>
        <div className='hidden md:block md:flex-[0.2] md:h-full border-r dark:border-zinc-900/30'>
          <div className=' p-6'>
            <h2 className='font-bold text-2xl tracking-tighter text-zinc-700 dark:text-zinc-400'>
              Messages
            </h2>
          </div>
          <div className='h-full '>
            <ChatList
              friendsList={friendsList}
              sessionUserId={sessionUser.id}
            />
          </div>
        </div>
      </>

      {/* Messsage */}
      <div className='flex-1 grow mt-[4.2rem] md:mt-0 bg-white dark:bg-zinc-950 w-full md:relative md:flex-[0.75]'>
        {children}
      </div>
    </div>
  );
};
export default DashboardLayout;
