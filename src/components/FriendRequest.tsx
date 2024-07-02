import { db } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Notification from './Notification';
import RequestList from './RequestList';
import { Dialog } from './ui/dialog';

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

  const unseenRequestCount = incomingRequests.length;

  return (
    <Dialog>
      <Notification
        sessionUserId={sessionUser?.id!}
        initialUnseenRequestCount={unseenRequestCount}
      />
      <RequestList
        sessionUserId={sessionUser?.id!}
        incomingRequests={incomingRequests}
      />
    </Dialog>
  );
};
export default FriendRequest;
