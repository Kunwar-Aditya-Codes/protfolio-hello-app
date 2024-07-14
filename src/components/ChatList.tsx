'use client';

import Link from 'next/link';
import { Separator } from './ui/separator';
import { chatHrefConstructor, toPusherKey } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';

const ChatList = ({
  friendsList,
  sessionUserId,
}: {
  friendsList: User[];
  sessionUserId: string;
}) => {
  const pathName = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [friends, setFriends] = useState<User[]>(friendsList);

  useEffect(() => {
    const friendKey = toPusherKey(`user:${sessionUserId}:friends`);
    pusherClient.subscribe(toPusherKey(`user:${sessionUserId}:chats`));
    pusherClient.subscribe(friendKey);

    const chatHandler = (message: Message) => {
      const shouldNotify =
        pathName !==
        `/dashboard/chat/${chatHrefConstructor(
          sessionUserId,
          message.senderId
        )}`;

      if (!shouldNotify) return;
      setUnseenMessages((prev) => [...prev, message]);
    };

    const friendHandler = (newFriend: User) => {
      setFriends((prev) => [...prev, newFriend]);
    };

    pusherClient.bind('new_message', chatHandler);
    pusherClient.bind('new_friend', friendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionUserId}:chats`));
      pusherClient.unsubscribe(friendKey);

      pusherClient.unbind('new_message', chatHandler);
      pusherClient.unbind('new_friend', friendHandler);
    };
  }, [pathName, sessionUserId]);

  useEffect(() => {
    if (pathName?.includes('/chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathName.includes(msg.senderId));
      });
    }
  }, [pathName]);

  return (
    <div className='h-full'>
      {friends.length > 0 ? (
        <>
          {friends.sort().map((friend) => {
            const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
              return unseenMsg.senderId === friend.id;
            }).length;
            return (
              <Link
                href={`/dashboard/chat/${chatHrefConstructor(
                  sessionUserId,
                  friend.id
                )}`}
                key={friend.id}
              >
                <div className='px-6 pt-4 dark:hover:bg-zinc-900  hover:bg-zinc-100/60'>
                  <div className='flex items-center space-x-2.5'>
                    <img
                      src={friend.profileImage}
                      alt='profile-image'
                      className='size-[2.7rem] rounded-full'
                    />
                    <div className='w-full flex items-center gap-x-2'>
                      <p className='font-bold text-lg text-zinc-600 dark:text-zinc-300'>
                        {friend.username}
                      </p>
                      {unseenMessagesCount > 0 ? (
                        <p className='bg-orange-500 text-white w-5 h-5 text-xs text-center flex items-center justify-center rounded-full'>
                          {unseenMessagesCount}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <Separator className='mt-3 border-zinc-100 dark:border-zinc-900 border' />
                </div>
              </Link>
            );
          })}
        </>
      ) : (
        <p className='text-left px-6 mt-4 text-lg text-muted-foreground  w-full'>
          No chats currently !
        </p>
      )}
    </div>
  );
};
export default ChatList;
