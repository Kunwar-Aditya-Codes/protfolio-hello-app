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
import { addFriendToChat } from '@/app/dashboard/(chat)/actions';
import { useToast } from './ui/use-toast';
import { PlusCircle, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type FormData = z.infer<typeof addFriendValidator>;

const AddFriend = () => {
  const { toast } = useToast();

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const { mutate } = useMutation({
    mutationKey: ['add-friend'],
    mutationFn: addFriendToChat,
    onSuccess: ({ success, message }) => {
      if (success === true) {
        reset({
          email: '',
        });
        toast({
          title: 'Request sent.',
          description: 'Your friend request has been sent successfully!',
          duration: 1500,
        });
      } else {
        toast({
          title: message,
          duration: 1500,
          variant: 'destructive',
        });
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
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger>
                <PlusCircle className='size-6 md:size-7 text-zinc-500 dark:text-zinc-300 dark:hover:text-zinc-400 hover:text-zinc-800' />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side={'right'}>
              <p>Add friend</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent className='dark:bg-zinc-950'>
          <DialogHeader>
            <DialogTitle className='text-xl'>Add Friend</DialogTitle>
          </DialogHeader>
          <div className='mt-1'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label
                htmlFor='email'
                className='text-sm text-zinc-600 dark:text-zinc-400'
              >
                Enter a valid email
              </label>
              <input
                {...register('email')}
                type='email'
                name='email'
                autoFocus
                placeholder='xyz@email.com'
                className='w-full p-2.5 mt-1.5 rounded-md text-sm dark:bg-zinc-900 dark:focus-visible:ring-offset-zinc-900  text-zinc-700 dark:text-zinc-200 outline-none border border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:border-hidden'
              />
              <Button className='mt-6' size={'sm'} variant={'outline'}>
                Submit
              </Button>
            </form>
          </div>

          <div className='text-sm mt-4 '>
            <p className='flex items-center gap-x-2'>
              <TriangleAlert className='size-4 text-orange-600' />
              <span className='dark:text-muted-foreground'>
                The user should be registered to be added as a friend!
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AddFriend;
