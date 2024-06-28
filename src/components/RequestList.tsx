'use client';

import { acceptFriendRequest } from '@/app/dashboard/actions';
import { useMutation } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';

interface RequestListProps {
  incomingRequests: {
    senderId: string;
    senderEmail: string;
    senderName: string;
  }[];
}

const RequestList = ({ incomingRequests }: RequestListProps) => {
  const { mutate: acceptFriendRequestMutation } = useMutation({
    mutationKey: ['accept-request'],
    mutationFn: acceptFriendRequest,
    // TODO: add success and error states
  });

  const handleAcceptRequest = (id: string) => {
    acceptFriendRequestMutation({ idToAdd: id });
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
            <button className='border-2 border-red-600 bg-red-200 rounded-md p-1'>
              <X className='size-4 text-red-600' />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
export default RequestList;
