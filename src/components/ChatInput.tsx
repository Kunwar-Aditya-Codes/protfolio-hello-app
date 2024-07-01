'use client';

import { Loader2, Send } from 'lucide-react';
import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '@/app/dashboard/chat/[id]/actions';
import { useToast } from './ui/use-toast';

const ChatInput = ({
  chatPartner,
  chatId,
}: {
  chatPartner: User;
  chatId: string;
}) => {
  const { toast } = useToast();
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>('');

  const { mutate, isPending } = useMutation({
    mutationKey: ['send-message'],
    mutationFn: sendMessage,

    onSuccess: ({ success }) => {
      if (success) {
        setInput('');
        textInputRef.current?.focus();
      }
    },

    onError: (error) => {
      toast({
        title: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSend = () => {
    if (!input || input.length < 0) {
      toast({
        title: 'No message to send!',
        variant: 'destructive',
        duration: 1700,
      });
      return;
    }

    mutate({
      text: input,
      chatId,
    });
  };
  return (
    <div className='px-6 py-4 bg-white'>
      <div className='relative focus-within:outline-2 bg-zinc-100 focus-within:bg-zinc-50 border rounded-lg px-2 py-3.5 focus-within:border-orange-600 focus-within:border-2'>
        <TextareaAutosize
          ref={textInputRef}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.username}`}
          className='w-full block resize-none bg-transparent focus:outline-none'
        />
        <div
          onClick={() => textInputRef.current?.focus()}
          className='py-2'
          aria-hidden='true'
        >
          <div className='py-px'>
            <div className='h-6' />
          </div>
        </div>

        <div className='absolute right-0 bottom-0 mb-2 mr-2 flex justify-between'>
          <div className='flex-shrink-0'>
            <Button
              size={'icon'}
              type='submit'
              onClick={() => handleSend()}
              disabled={isPending}
              className='disabled:bg-orange-400'
            >
              {isPending ? (
                <Loader2 className='size-5 animate-spin' />
              ) : (
                <Send className='size-5' />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatInput;
