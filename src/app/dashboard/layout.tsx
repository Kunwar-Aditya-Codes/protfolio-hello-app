import AddFriend from '@/components/AddFriend';
import { buttonVariants } from '@/components/ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();

  if (!sessionUser?.id || !sessionUser?.email) notFound();

  return (
    <div className='flex flex-col h-screen bg-zinc-200 p-2'>
      <div className='flex items-center justify-between bg-white p-5 rounded-xl'>
        <AddFriend />
        <Link
          href={'/api/auth/logout'}
          className={buttonVariants({
            size: 'sm',
            variant: 'ghost',
          })}
        >
          Logout
        </Link>
      </div>
      <div className='grow'>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default DashboardLayout;
