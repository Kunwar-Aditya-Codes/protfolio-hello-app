import ProfileImage from '@/components/ProfileImage';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound } from 'next/navigation';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser || !sessionUser.id) notFound();

  const user = (await db.get(`user:${sessionUser.id}`)) as User;

  return (
    <div className='p-6 bg-zinc-100 dark:bg-zinc-950 h-full'>
      <div className='bg-white dark:bg-gradient-to-b from-zinc-950 from-65% to-zinc-900  p-6 shadow-sm rounded-lg'>
        <div className='flex items-center gap-x-2.5'>
          <Separator className='h-7 w-fit border-2 border-orange-600 rounded-3xl' />
          <p className='text-zinc-600 dark:text-zinc-300 font-semibold tracking-tight'>
            User Details
          </p>
        </div>

        <div className='mt-6 flex flex-col lg:flex-row lg:h-[8rem]'>
          <ProfileImage user={user} />

          <div className='flex-[0.85] flex flex-col justify-between w-full h-full py-2'>
            <div>
              <h1 className='text-2xl text-zinc-800 dark:text-zinc-200 tracking-tight font-medium'>
                {user.username}
              </h1>
            </div>
            <div className='mt-4 lg:mt-0'>
              <div className='flex flex-col gap-1'>
                <span className='text-xs tracking-wide text-zinc-800 dark:text-zinc-400   bg-zinc-200 dark:bg-zinc-950 w-fit px-1.5 py-1 rounded-sm'>
                  Email
                </span>
                <p className='text-sm text-zinc-600  dark:text-zinc-400'>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};
export default Page;
