'use client';

import { pusherClient } from '@/lib/pusher';
import { Video, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { PresenceChannel } from 'pusher-js';

const VideoCallState = ({
  id,
  sessionUserId,
}: {
  id: string;
  sessionUserId: string;
}) => {
  const [incomingCall, setIncomingCall] = useState<boolean>(false);
  const channelRef = useRef<PresenceChannel | null>(null);

  useEffect(() => {
    pusherClient.subscribe(`presence-${id}`);
    channelRef.current = pusherClient.channel(
      `presence-${id}`
    ) as PresenceChannel;

    const notifyCallHandler = () => {
      setIncomingCall(true);
    };
    pusherClient.bind('client-ready', notifyCallHandler);

    const callEndHandler = () => {
      setIncomingCall(false);
    };
    pusherClient.bind('client-callend', callEndHandler);

    return () => {
      pusherClient.unsubscribe(`presence-${id}`);
      pusherClient.unbind('client-ready', notifyCallHandler);
      pusherClient.unbind('client-callend', callEndHandler);
    };
  }, [id, sessionUserId]);

  const declineCall = () => {
    if (channelRef.current) {
      channelRef.current.trigger('client-callend', {});
    }
  };

  return (
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
  );
};
export default VideoCallState;
