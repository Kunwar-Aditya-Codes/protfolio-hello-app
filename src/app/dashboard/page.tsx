import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.id || !sessionUser?.email) notFound();

  return <div className=''>dashboard</div>;
};
export default Page;
