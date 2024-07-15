'use client';

import { Camera, Image, Loader2, MousePointerSquareDashed } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import Dropzone, { FileRejection } from 'react-dropzone';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { updateProfileImage } from '@/app/dashboard/(chat)/settings/actions';

const ProfileImage = ({ user }: { user: User }) => {
  const { toast } = useToast();

  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { startUpload, isUploading } = useUploadThing('profileUploader', {
    onClientUploadComplete: ([data]) => {
      const { profileImage: newProfileImage } = data.serverData;
      mutate({
        profileImageUrl: newProfileImage,
        user,
      });
      setUploadProgress(0);
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['update-profile-image'],
    mutationFn: updateProfileImage,
    onSuccess: ({ success }) => {
      if (success) {
        toast({
          title: 'Profile image updated successfully!',
        });
      }
    },
  });

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
    startUpload(acceptedFiles, { sessionUserId: user.id });
    setIsDragOver(false);
  };

  return (
    <div className='flex-[0.15] relative'>
      <img
        src={user.profileImage}
        alt='profile'
        className='w-[8rem] h-[8rem] rounded-full'
      />
      <Dialog>
        <DialogTrigger>
          <Camera className='size-7 absolute bottom-4 lg:bottom-0 left-3 fill-black text-white' />
        </DialogTrigger>
        <DialogContent className='dark:bg-zinc-950'>
          <DialogHeader>
            <DialogTitle className='text-xl'>Update Profile Image</DialogTitle>
          </DialogHeader>
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
              <div {...getRootProps()} className='flex flex-col h-full'>
                <div className='border-2 border-dashed rounded-lg w-full flex flex-1 flex-col items-center justify-center h-full p-6'>
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
                        <p>Updating, please wait..</p>
                      </div>
                    ) : isDragOver ? (
                      <p>
                        <span className='font-semibold'>Drop file</span> to
                        upload
                      </p>
                    ) : (
                      <p>
                        <span className='font-semibold'>Click to upload</span>{' '}
                        or drag and drop
                      </p>
                    )}
                  </div>

                  {isPending ? null : (
                    <p className='text-xs text-zinc-500'>PNG , JPEG, JPG</p>
                  )}
                </div>
              </div>
            )}
          </Dropzone>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ProfileImage;
