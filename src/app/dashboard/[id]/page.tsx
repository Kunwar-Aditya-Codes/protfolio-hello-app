import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound } from 'next/navigation';

const Page = async ({ params }: { params: { id: string } }) => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();
  if (!sessionUser?.id || !sessionUser?.email) return notFound();

  const { id } = params;
  if (!id) return notFound();

  const friendDetails = (await db.get(`user:${id}`)) as User;

  return <div>{friendDetails.username}</div>;
};
export default Page;
