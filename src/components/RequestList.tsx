'use client';

import {
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/app/dashboard/actions';
import { useMutation } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

interface RequestListProps {
  incomingRequests: {
    senderId: string;
    senderEmail: string;
    senderName: string;
  }[];
}

const RequestList = ({ incomingRequests }: RequestListProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: acceptFriendRequestMutation } = useMutation({
    mutationKey: ['accept-request'],
    mutationFn: acceptFriendRequest,
    onSuccess: ({ success }) => {
      if (success) {
        toast({
          title: 'You are now friends.',
          duration: 1500,
        });
        router.refresh();
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
    onSuccess: ({ success }) => {
      if (success) {
        toast({
          title: 'Friend request denied.',
          duration: 1500,
        });
        router.refresh();
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
    <>
      {incomingRequests.map((sender) => (
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
    </>
  );
};
export default RequestList;
