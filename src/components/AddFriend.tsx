'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { addFriendToChat } from '@/app/dashboard/actions';
import { useToast } from './ui/use-toast';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FormData = z.infer<typeof addFriendValidator>;

const AddFriend = () => {
  const { toast } = useToast();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const { mutate } = useMutation({
    mutationKey: ['add-friend'],
    mutationFn: addFriendToChat,
    onSuccess: ({ success }) => {
      if (success) {
        reset({
          email: '',
        });
        toast({
          title: 'Request sent.',
          description: 'Your friend request has been sent successfully!',
          duration: 1500,
        });
        // router.refresh();
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

  const onSubmit = (data: FormData) => {
    mutate({ email: data.email });
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <PlusCircle className='size-7 text-zinc-500 hover:text-zinc-800' />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>Add Friend</DialogTitle>
          </DialogHeader>
          <div className='mt-1'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor='email' className='text-sm text-zinc-600'>
                Enter a valid email
              </label>
              <input
                {...register('email')}
                type='email'
                name='email'
                autoFocus
                placeholder='xyz@email.com'
                className='w-full p-2.5 mt-1.5 rounded-md text-sm text-zinc-700 outline-none border border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:border-hidden'
              />
              <Button className='mt-6' size={'sm'} variant={'outline'}>
                Submit
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AddFriend;
