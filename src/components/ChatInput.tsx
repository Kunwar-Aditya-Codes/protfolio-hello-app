'use client';

import {
  Image,
  Loader2,
  MousePointerSquareDashed,
  Plus,
  Send,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '@/app/dashboard/(chat)/chat/[id]/actions';
import { useToast } from './ui/use-toast';
import { Progress } from './ui/progress';
import { useUploadThing } from '@/lib/uploadthing';
import Dropzone, { FileRejection } from 'react-dropzone';

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
  const [chatImageUrl, setChatImageUrl] = useState<string | undefined>(
    undefined
  );
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDropZoneOpen, setIsDropZoneOpen] = useState<boolean>(false);

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: ([data]) => {
      const { chatImageUrl: urlFromServer } = data.serverData;
      setChatImageUrl(urlFromServer);
      setUploadProgress(0);
      setIsDropZoneOpen(false);
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['send-message'],
    mutationFn: sendMessage,

    onSuccess: ({ success }) => {
      if (success) {
        setInput('');
        setChatImageUrl(undefined);
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
      chatImageUrl,
    });
  };

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;
    setIsDragOver(false);
    toast({
      title: `${file.file.type} type is not supported.`,
      description: 'Please choose a PNG, JPG or JPEG file type.',
      variant: 'destructive',
    });
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles, { chatId });
    setIsDragOver(false);
  };

  return (
    <div className='px-6 py-4 bg-white dark:bg-zinc-950 dark:border-t dark:border-t-zinc-900/25'>
      {chatImageUrl && chatImageUrl !== undefined ? (
        <p className='mb-2 border border-zinc-600 dark:border-zinc-800 border-dashed w-fit px-4 py-1.5 rounded-lg'>
          Image attached
        </p>
      ) : null}
      <div className='relative focus-within:outline-2 bg-zinc-100 dark:bg-zinc-950 focus-within:bg-zinc-50 border rounded-lg px-2 py-3.5 focus-within:border-orange-600 focus-within:border-2'>
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

        <div className='absolute right-0 bottom-0 mb-2 mr-2 flex justify-between gap-x-2.5'>
          <div>
            <Button
              size={'icon'}
              type='button'
              onClick={() => setIsDropZoneOpen(true)}
              variant={'outline'}
              className='border-orange-600 bg-transparent dark:bg-zinc-900 dark:border-none '
            >
              <Plus className='size-5 text-orange-600 dark:text-white' />
            </Button>
          </div>
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
      {isDropZoneOpen ? (
        <div className='z-[9999] absolute flex items-center justify-center bg-black/80 top-0 bottom-0 left-0 right-0'>
          <div className='  w-[75%] h-[25rem] rounded-xl bg-white dark:bg-zinc-950'>
            <Dropzone
              onDropRejected={onDropRejected}
              onDropAccepted={onDropAccepted}
              accept={{
                'image/png': ['.png'],
                'image/jpeg': ['.jpeg'],
                'image/jpg': ['.jpg'],
              }}
              onDragEnter={() => setIsDragOver(true)}
              onDragLeave={() => setIsDragOver(false)}
            >
              {({ getRootProps, getInputProps }) => (
                <div className='flex flex-col h-full'>
                  <div className='p-2 flex items-center justify-end mt-1 mr-1'>
                    <button onClick={() => setIsDropZoneOpen(false)}>
                      <X className='size-6 p-0.5 hover:border-2 hover:border-orange-600 transition-colors text-orange-600 rounded-lg ' />
                    </button>
                  </div>
                  <div className='h-full px-8 pt-4 pb-6 w-full'>
                    <div
                      {...getRootProps()}
                      className='border-2 border-dashed rounded-lg w-full flex flex-1 flex-col items-center justify-center h-full'
                    >
                      <input {...getInputProps()} />
                      {isDragOver ? (
                        <MousePointerSquareDashed className='size-6 text-zinc-500 mb-2' />
                      ) : isUploading || isPending ? (
                        <Loader2 className='size-6 animate-spin text-zinc-500 mb-2' />
                      ) : (
                        <Image className='size-6 text-zinc-500 mb-2' />
                      )}
                      <div className='flex flex-col justify-center mb-2 text-sm text-zinc-700'>
                        {isUploading ? (
                          <div className='flex flex-col items-center'>
                            <p>Uploading...</p>
                            <Progress
                              value={uploadProgress}
                              className='mt-2 w-40 h-2 bg-gray-300'
                            />
                          </div>
                        ) : isPending ? (
                          <div className='flex flex-col items-center '>
                            <p>Redirecting, please wait...</p>
                          </div>
                        ) : isDragOver ? (
                          <p>
                            <span className='font-semibold'>Drop file</span> to
                            upload
                          </p>
                        ) : (
                          <p className='dark:text-zinc-400'>
                            <span className='font-semibold dark:text-zinc-200'>
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                        )}
                      </div>

                      {isPending ? null : (
                        <p className='text-xs text-zinc-500'>PNG , JPEG, JPG</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Dropzone>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default ChatInput;
