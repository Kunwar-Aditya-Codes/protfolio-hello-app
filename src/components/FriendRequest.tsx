import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { BellPlus } from 'lucide-react';
import RequestList from './RequestList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const FriendRequest = async () => {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();

  const incomingRequestIds = await db.smembers(
    `user:${sessionUser?.id}:incoming_friend_request`
  );

  const incomingRequests = await Promise.all(
    incomingRequestIds.map(async (senderId) => {
      const sender = (await db.get(`user:${senderId}`)) as User;
      return {
        senderId,
        senderEmail: sender.email,
        senderName: sender.username,
      };
    })
  );

  return (
    <div className=''>
      <Dialog>
        <DialogTrigger>
          <BellPlus className='size-7 text-zinc-500 hover:text-zinc-800' />
        </DialogTrigger>
        <DialogContent className='px-4'>
          <DialogHeader>
            <DialogTitle className='text-xl'>Friend Requests</DialogTitle>
          </DialogHeader>
          <div className='mt-2 grid h-[24rem] overflow-hidden overflow-y-auto'>
            <RequestList incomingRequests={incomingRequests} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default FriendRequest;
