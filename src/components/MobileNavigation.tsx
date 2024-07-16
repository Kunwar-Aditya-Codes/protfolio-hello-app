import { Home, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import AddFriend from './AddFriend';
import FriendRequest from './FriendRequest';
import ThemeSwitcher from './ThemeSwitcher';

const MobileNavigation = () => {
  return (
    <div className='bg-white dark:bg-zinc-950  border-b dark:border-b-zinc-900/15 dark:shadow-none absolute top-0 left-0 right-0 md:hidden h-[4rem] flex items-center px-6 shadow-md'>
      <div className='w-full flex items-center justify-between'>
        <div className='flex items-start gap-x-6'>
          <Link href={'/dashboard'}>
            <Home className='size-6 md:size-7 text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-400' />
          </Link>
          <AddFriend />
          <FriendRequest />
          <Link href={'/dashboard/settings'}>
            <Settings className='size-6 md:size-7 text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-400' />
          </Link>
        </div>
        <div className='flex items-center gap-x-8'>
          <ThemeSwitcher />
          <Link href={'/api/auth/logout'} className=' '>
            <LogOut className='size-5 text-zinc-600  dark:text-zinc-300 ' />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default MobileNavigation;
