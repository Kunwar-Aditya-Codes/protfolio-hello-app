'use client';

import { CameraOff, MicOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const VideoCall = ({ you, partner }: { you: User; partner: User }) => {
  const router = useRouter();

  return (
    <div className='h-full flex flex-col'>
      <div className='flex items-center justify-end'>
        <button
          onClick={() => {
            router.push('/dashboard');
          }}
          className='bg-red-600 px-3.5 py-2 rounded-lg'
        >
          Leave
        </button>
      </div>
      <div className=' grow flex flex-col md:flex-row mt-4 md:mt-0 md:gap-y-0 gap-y-6 md:gap-x-4'>
        <div className='flex-[0.5] flex flex-col  justify-center'>
          <div className='border h-full md:h-[25rem] rounded-xl relative'>
            <span className='absolute top-0 left-0 bg-orange-600 px-2 text-xs py-1 rounded-tl-xl'>
              {you.username}
            </span>
            <div className='absolute bottom-5 right-5 flex items-center gap-x-12'>
              <MicOff className='size-6' />
              <CameraOff className='size-6' />
            </div>
          </div>
        </div>
        <div className='flex-[0.5] flex flex-col justify-center'>
          <div className='relative border h-full md:h-[25rem] rounded-xl'>
            <span className='absolute top-0 left-0 bg-orange-600 px-2 text-xs py-1 rounded-tl-xl'>
              {partner.username}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoCall;
