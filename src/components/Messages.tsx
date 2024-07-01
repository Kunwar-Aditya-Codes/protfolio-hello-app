'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRef, useState } from 'react';

interface MessagesProps {
  initialMessages: Message[];
  sessionUserId: string;
  chatId: string;
  chatPartner: User;
}

const Messages = ({
  chatId,
  chatPartner,
  initialMessages,
  sessionUserId,
}: MessagesProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm aaaa');
  };

  

  return (
    <div
      className='overflow-y-scroll flex h-full flex-col-reverse px-6 '
      id='message'
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionUserId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div className='pb-4' key={`${message.id}-${message.timestamp}`}>
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}
            >
              <span
                className={cn(
                  ' rounded-full text-lg font-light justify-between shadow-md px-5 flex items-baseline  py-2.5',
                  {
                    'bg-orange-600 text-white': isCurrentUser,
                    'bg-white text-zinc-800': !isCurrentUser,
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
                    isCurrentUser ? 'text-zinc-100' : 'text-zinc-600'
                  )}
                >
                  {formatTimestamp(message.timestamp)}
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Messages;
