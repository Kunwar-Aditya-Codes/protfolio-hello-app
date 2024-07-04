'use client';

import { Bell } from 'lucide-react';
import { DialogTrigger } from './ui/dialog';
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

const Notification = ({
  sessionUserId,
  initialUnseenRequestCount,
}: {
  sessionUserId: string;
  initialUnseenRequestCount: number;
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionUserId}:incoming_friend_request`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionUserId}:friends`));
    pusherClient.subscribe(toPusherKey(`user:${sessionUserId}:reject`));

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1);
    };

    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1);
    };

    const denyFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1);
    };

    pusherClient.bind('incoming_friend_request', friendRequestHandler);
    pusherClient.bind('new_friend', addedFriendHandler);
    pusherClient.bind('reject_friend', denyFriendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionUserId}:incoming_friend_request`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionUserId}:friends`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionUserId}:reject`));

      pusherClient.unbind('incoming_friend_request', friendRequestHandler);
      pusherClient.unbind('new_friend', addedFriendHandler);
      pusherClient.unbind('reject_friend', denyFriendHandler);
    };
  }, []);

  return (
    <DialogTrigger className='relative'>
      <Bell className='size-6 md:size-7 text-zinc-500 hover:text-zinc-800' />
      <div className='absolute -top-1 left-4'>
        {unseenRequestCount > 0 ? (
          <p className='bg-orange-500 size-4 text-xs rounded-full text-white font-medium '>
            {unseenRequestCount}
          </p>
        ) : null}
      </div>
    </DialogTrigger>
  );
};
export default Notification;
