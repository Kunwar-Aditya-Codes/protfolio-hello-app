'use client';

import {
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/app/dashboard/(chat)/actions';
import { useMutation } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface RequestListProps {
  incomingRequests: IncomingFriendRequest[];
  sessionUserId: string;
}

const RequestList = ({ incomingRequests, sessionUserId }: RequestListProps) => {
  const [friendRequests, setFriendRequests] =
    useState<IncomingFriendRequest[]>(incomingRequests);
  const { toast } = useToast();

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionUserId}:incoming_friend_request`)
    );

    const friendRequestHandler = ({
      senderId,
      senderEmail,
      senderName,
    }: IncomingFriendRequest) => {
      setFriendRequests((prev) => [
        ...prev,
        {
          senderEmail,
          senderId,
          senderName,
        },
      ]);
    };
    pusherClient.bind('incoming_friend_request', friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionUserId}:incoming_friend_request`)
      );
      pusherClient.unbind('incoming_friend_request', friendRequestHandler);
    };
  }, [sessionUserId]);

  const { mutate: acceptFriendRequestMutation } = useMutation({
    mutationKey: ['accept-request'],
    mutationFn: acceptFriendRequest,
    onSuccess: ({ success, senderId }) => {
      if (success) {
        toast({
          title: 'You are now friends.',
          duration: 1500,
        });

        setFriendRequests((prev) =>
          prev.filter((request) => request.senderId !== senderId)
        );
      }
    },
    onError: (error) => {
      toast({
        title: error.message,
        duration: 1500,
        variant: 'destructive',
      });
    },
  });

  const { mutate: rejectFriendRequestMutation } = useMutation({
    mutationKey: ['reject-request'],
    mutationFn: rejectFriendRequest,
    onSuccess: ({ success, senderId }) => {
      if (success) {
        toast({
          title: 'Friend request denied.',
          duration: 1500,
        });
        setFriendRequests((prev) =>
          prev.filter((request) => request.senderId !== senderId)
        );
      }
    },
    onError: (error) => {
      toast({
        title: error.message,
        duration: 1500,
        variant: 'destructive',
      });
    },
  });

  const handleAcceptRequest = (id: string) => {
    acceptFriendRequestMutation({ idToAdd: id });
  };
  const handleRejectRequest = (id: string) => {
    rejectFriendRequestMutation({ idToDeny: id });
  };

  return (
    <DialogContent className='px-4'>
      <DialogHeader>
        <DialogTitle className='text-xl'>Friend Requests</DialogTitle>
      </DialogHeader>
      <div className='mt-2 grid h-[24rem] overflow-hidden overflow-y-auto'>
        {friendRequests.map((sender) => (
          <div
            key={sender.senderId}
            className='shadow-sm p-2 border-b h-fit flex items-center justify-between'
          >
            <div>
              <p className='text-zinc-950  text-sm font-medium'>
                {sender.senderName}
              </p>
              <p className='text-sm text-zinc-700'>{sender.senderEmail}</p>
            </div>
            <div className='flex items-center gap-x-4'>
              <button
                onClick={() => handleAcceptRequest(sender.senderId)}
                className='border-2 border-green-600 bg-green-200 rounded-md p-1'
              >
                <Check className='size-4 text-green-600' />
              </button>
              <button
                onClick={() => handleRejectRequest(sender.senderId)}
                className='border-2 border-red-600 bg-red-200 rounded-md p-1'
              >
                <X className='size-4 text-red-600' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  );
};
export default RequestList;
