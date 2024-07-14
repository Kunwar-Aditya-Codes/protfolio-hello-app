'use client';

import { pusherClient } from '@/lib/pusher';
import { cn, toPusherKey } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

interface MessagesProps {
  initialMessages: Message[];
  sessionUserId: string;
  chatId: string;
  chatPartner: User;
  chatSessionUser: User;
}

const Messages = ({
  chatId,
  chatPartner,
  initialMessages,
  sessionUserId,
  chatSessionUser,
}: MessagesProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    const chatChannelKey = toPusherKey(`chat:${chatId}`);

    pusherClient.subscribe(chatChannelKey);

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };
    pusherClient.bind('incoming_message', messageHandler);

    return () => {
      pusherClient.unsubscribe(chatChannelKey);
      pusherClient.unbind('incoming_message', messageHandler);
    };
  }, [chatId, sessionUserId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm aaaa');
  };

  return (
    <div
      className='overflow-y-scroll h-[29rem] md:h-[34rem] flex flex-col-reverse px-6 '
      id='message'
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionUserId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div className='pb-4 pt-6' key={`${message.id}-${message.timestamp}`}>
            <div>
              <div
                className={cn('flex items-end mb-2 w-full ', {
                  'justify-end pr-6': isCurrentUser,
                  'ml-6': !isCurrentUser,
                })}
              >
                <img
                  src={message.chatImageUrl}
                  alt=''
                  className='w-[45%] md:w-[30%] lg:w-[20%]'
                />
              </div>

              <div
                className={cn('flex items-end', {
                  'justify-end': isCurrentUser,
                })}
              >
                <div
                  className={cn('flex items-end gap-x-2', {
                    'flex-row-reverse': isCurrentUser,
                  })}
                >
                  <div>
                    <img
                      src={
                        message.senderId === sessionUserId
                          ? chatSessionUser.profileImage
                          : chatPartner.profileImage
                      }
                      alt=''
                      className='size-6 rounded-full'
                    />
                  </div>
                  <div
                    className={cn(
                      ' rounded-full md:text-lg font-light justify-between shadow-md px-5 flex items-baseline  py-1.5 md:py-2.5',
                      {
                        'bg-orange-600 text-white': isCurrentUser,
                        'bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300':
                          !isCurrentUser,
                        'rounded-br-none':
                          !hasNextMessageFromSameUser && isCurrentUser,
                        'rounded-bl-none':
                          !hasNextMessageFromSameUser && !isCurrentUser,
                      }
                    )}
                  >
                    <span className=''>{message.text}</span>
                    <span
                      className={cn(
                        'ml-4 text-xs',
                        isCurrentUser
                          ? 'text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400'
                      )}
                    >
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Messages;
