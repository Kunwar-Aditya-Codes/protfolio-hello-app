import { LogOut } from 'lucide-react';
import Link from 'next/link';
import AddFriend from './AddFriend';
import FriendRequest from './FriendRequest';

const MobileNavigation = () => {
  return (
    <div className='bg-white  border-t absolute top-0 left-0 right-0 md:hidden h-[4rem] flex items-center px-6 shadow-md'>
      <div className='w-full flex items-center justify-between'>
        <div className='flex items-start gap-x-6'>
          <AddFriend />
          <FriendRequest />
        </div>
        <div className='flex items-center'>
          <Link href={'/api/auth/logout'} className=' '>
            <LogOut className='size-5 text-zinc-600  ' />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default MobileNavigation;
