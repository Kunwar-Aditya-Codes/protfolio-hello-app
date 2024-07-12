'use client';

import { pusherClient } from '@/lib/pusher';
import { Circle, Video } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const VideoCallState = ({
  id,
  sessionUserId,
}: {
  id: string;
  sessionUserId: string;
}) => {
  const [onCall, setOnCall] = useState<boolean>(false);

  useEffect(() => {
    pusherClient.subscribe(`presence-${id}`);

    const notifyCallHandler = () => {
      setOnCall(true);
    };
    pusherClient.bind('client-ready', notifyCallHandler);

    const callEndHandler = () => {
      setOnCall(false);
    };
    pusherClient.bind('client-callend', callEndHandler);

    return () => {
      pusherClient.unsubscribe(`presence-${id}`);
      pusherClient.unbind('client-ready', notifyCallHandler);
      pusherClient.unbind('client-callend', callEndHandler);
    };
  }, [id, sessionUserId]);

  return (
    <div className='mr-6 md:mr-0 relative'>
      <Link href={`/dashboard/call/${id}`}>
        <Video className='size-7 text-orange-600 rotate-180' />
        {onCall ? (
          <>
            <Circle className='size-2.5 text-green-500 fill-green-500 animate-ping absolute bottom-1 right-0' />
            <Circle className='size-2.5 text-green-500 fill-green-500  absolute bottom-1 right-0' />
          </>
        ) : null}
      </Link>
    </div>
  );
};
export default VideoCallState;
