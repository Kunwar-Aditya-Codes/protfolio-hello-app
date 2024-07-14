'use client';

import { pusherClient } from '@/lib/pusher';
import { Circle, Video, X } from 'lucide-react';
import Link from 'next/link';
import { Members, PresenceChannel } from 'pusher-js';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const MessageTopBar = ({
  id,
  sessionUserId,
  chatPartner,
}: {
  id: string;
  sessionUserId: string;
  chatPartner: User;
}) => {
  const [incomingCall, setIncomingCall] = useState<boolean>(false);
  const [isUserOnline, setIsUserOnline] = useState<boolean>(false);
  const channelRef = useRef<PresenceChannel | null>(null);

  useEffect(() => {
    const presenceChannel = pusherClient.subscribe(
      `presence-${id}`
    ) as PresenceChannel;

    const handleSubscriptionSucceeded = (members: Members) => {
      setIsUserOnline(Object.keys(members.members).length > 1);
    };

    const handleMemberAdded = (member: any) => {
      if (member.id !== sessionUserId) {
        setIsUserOnline(true);
      }
    };

    const handleMemberRemoved = (member: any) => {
      if (member.id !== sessionUserId) {
        setIsUserOnline(false);
      }
    };

    presenceChannel.bind(
      'pusher:subscription_succeeded',
      handleSubscriptionSucceeded
    );
    presenceChannel.bind('pusher:member_added', handleMemberAdded);
    presenceChannel.bind('pusher:member_removed', handleMemberRemoved);

    const notifyCallHandler = () => setIncomingCall(true);
    const callEndHandler = () => setIncomingCall(false);

    presenceChannel.bind('client-ready', notifyCallHandler);
    presenceChannel.bind('client-callend', callEndHandler);

    channelRef.current = presenceChannel;

    return () => {
      presenceChannel.unbind(
        'pusher:subscription_succeeded',
        handleSubscriptionSucceeded
      );
      presenceChannel.unbind('pusher:member_added', handleMemberAdded);
      presenceChannel.unbind('pusher:member_removed', handleMemberRemoved);
      presenceChannel.unbind('client-ready', notifyCallHandler);
      presenceChannel.unbind('client-callend', callEndHandler);
      pusherClient.unsubscribe(`presence-${id}`);
    };
  }, [id, sessionUserId]);

  const declineCall = () => {
    if (channelRef.current) {
      channelRef.current.trigger('client-callend', {});
    }
  };

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex items-center gap-x-2.5'>
        <img
          src={chatPartner.profileImage}
          alt='profile-avatar'
          className='size-[2.5rem] rounded-full'
        />
        <div>
          <div className='flex items-center gap-x-2'>
            <h1 className='text-base tracking-tight text-zinc-800 font-medium'>
              {chatPartner.username}
            </h1>
            {isUserOnline ? (
              <div className='flex items-center'>
                <Circle className='mr-1 text-green-600 fill-green-600 size-2.5' />
                <span className='text-xs  md:hidden'>Online</span>
              </div>
            ) : null}
          </div>
          <p className='hidden md:block text-xs font-medium text-muted-foreground'>
            {chatPartner.email}
          </p>
        </div>
      </div>

      <div className='mr-6 md:mr-0 relative'>
        {incomingCall ? null : (
          <Link href={`/dashboard/call/${id}`}>
            <Video className='size-7 text-orange-600 rotate-180' />
          </Link>
        )}

        <Dialog open={incomingCall}>
          {incomingCall ? (
            <DialogTrigger>
              <Video className='size-7 text-orange-700 animate-pulse rotate-180' />
            </DialogTrigger>
          ) : null}
          <DialogContent className='py-16'>
            <DialogHeader>
              <DialogTitle className='text-center text-2xl'>
                Incoming Video Call
              </DialogTitle>
            </DialogHeader>
            <div className='flex justify-center gap-x-12 mt-12'>
              <Link href={`/dashboard/call/${id}`}>
                <Button
                  size={'icon'}
                  className='animate-bounce bg-green-600 hover:bg-green-700 rounded-full w-12 h-12 p-2'
                >
                  <Video className='size-12 ' />
                </Button>
              </Link>
              <Button
                size={'icon'}
                className='  rounded-full w-12 h-12 p-2'
                variant='destructive'
                onClick={declineCall}
              >
                <X className='size-12 ' />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default MessageTopBar;
