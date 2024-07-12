'use client';

import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Pusher, { Members, PresenceChannel } from 'pusher-js';
import { pusherClient } from '@/lib/pusher';

const ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun2.l.google.com:19302',
    },
  ],
};

const VideoCall = ({
  you,
  partner,
  callId,
}: {
  you: User;
  partner: User;
  callId: string;
}) => {
  const router = useRouter();
  const host = useRef(false);

  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  // Pusher specific refs
  const pusherRef = useRef<Pusher>();
  const channelRef = useRef<PresenceChannel>();

  // Webrtc refs
  const rtcConnection = useRef<RTCPeerConnection | null>();
  const userStream = useRef<MediaStream>();

  const yourVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: 'ap2',
      authEndpoint: '/api/pusher/auth',
    });

    channelRef.current = pusherRef.current.subscribe(
      `presence-${callId}`
    ) as PresenceChannel;

    channelRef.current.bind(
      'pusher:subscription_succeeded',
      (members: Members) => {
        if (members.count === 1) {
          host.current = true;
        }

        if (members.count > 2) {
          router.push(`/dashboard/chat/${callId}`);
        }

        handleRoomJoined();
      }
    );

    channelRef.current.bind('pusher:member_removed', handlePeerLeaving);

    channelRef.current.bind(
      'client-offer',
      (offer: RTCSessionDescriptionInit) => {
        if (!host.current) {
          handleReceivedOffer(offer);
        }
      }
    );

    channelRef.current.bind('client-ready', () => {
      console.log('client ready initiating call!');
      initiateCall();
    });

    channelRef.current.bind(
      'client-answer',
      (answer: RTCSessionDescriptionInit) => {
        // answer is sent by non-host, so only host should handle it
        if (host.current) {
          handleAnswerReceived(answer as RTCSessionDescriptionInit);
        }
      }
    );

    channelRef.current.bind(
      'client-ice-candidate',
      (iceCandidate: RTCIceCandidate) => {
        // answer is sent by non-host, so only host should handle it
        handlerNewIceCandidateMsg(iceCandidate);
      }
    );

    return () => {
      if (pusherRef.current)
        pusherRef.current.unsubscribe(`presence-${callId}`);
    };
  }, [callId]);

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
      })
      .then((stream) => {
        userStream.current = stream;
        yourVideo.current!.srcObject = stream;
        yourVideo.current!.onloadedmetadata = () => {
          yourVideo.current!.play;
        };

        if (!host.current) {
          console.log('triggering client ready');
          channelRef.current!.trigger('client-ready', {});
          channelRef.current!.trigger('client-callinit', { initiator: you });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlePeerLeaving = () => {
    host.current = true;
    if (partnerVideo.current?.srcObject) {
      (partnerVideo.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (rtcConnection.current) {
      rtcConnection.current.ontrack = null;
      rtcConnection.current.onicecandidate = null;
      rtcConnection.current.close();
      rtcConnection.current = null;
    }
  };
  const initiateCall = () => {
    if (host.current) {
      rtcConnection.current = createPeerConnection();

      userStream.current?.getTracks().forEach((track) => {
        rtcConnection.current?.addTrack(track, userStream.current!);
      });

      rtcConnection
        .current!.createOffer()
        .then((offer) => {
          rtcConnection.current!.setLocalDescription(offer);
          channelRef.current?.trigger('client-offer', offer);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleReceivedOffer = (offer: RTCSessionDescriptionInit) => {
    rtcConnection.current = createPeerConnection();

    userStream.current?.getTracks().forEach((track) => {
      rtcConnection.current?.addTrack(track, userStream.current!);
    });

    rtcConnection.current.setRemoteDescription(offer);

    rtcConnection.current
      .createAnswer()
      .then((answer) => {
        rtcConnection.current!.setLocalDescription(answer);
        channelRef.current?.trigger('client-answer', answer);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleAnswerReceived = (answer: RTCSessionDescriptionInit) => {
    rtcConnection
      .current!.setRemoteDescription(answer)
      .catch((error) => console.log(error));
  };

  const handleICECandidateEvent = async (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      channelRef.current?.trigger('client-ice-candidate', event.candidate);
    }
  };
  const handlerNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
    const candidate = new RTCIceCandidate(incoming);

    rtcConnection
      .current!.addIceCandidate(candidate)
      .catch((error) => console.log(error));
  };
  const handleTrackEvent = (event: RTCTrackEvent) => {
    partnerVideo.current!.srcObject = event.streams[0];
  };

  const toggleMediaStream = (type: 'video' | 'audio', state: boolean) => {
    userStream.current!.getTracks().forEach((track) => {
      if (track.kind === type) {
        track.enabled = !state;
      }
    });
  };
  const leaveRoom = () => {
    if (yourVideo.current!.srcObject) {
      (yourVideo.current!.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (partnerVideo.current!.srcObject) {
      (partnerVideo.current!.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (rtcConnection.current) {
      rtcConnection.current.ontrack = null;
      rtcConnection.current.onicecandidate = null;
      rtcConnection.current.close();
      rtcConnection.current = null;
    }

    router.push(`/dashboard/chat/${callId}`);
  };
  const toggleMic = () => {
    toggleMediaStream('audio', micActive);
    setMicActive((prev) => !prev);
  };
  const toggleCamera = () => {
    toggleMediaStream('video', cameraActive);
    setCameraActive((prev) => !prev);
  };

  const createPeerConnection = () => {
    const connection = new RTCPeerConnection(ICE_SERVERS);

    connection.onicecandidate = handleICECandidateEvent;

    connection.ontrack = handleTrackEvent;

    connection.onicecandidateerror = (e) => console.log(e);

    return connection;
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-6'>
          <button onClick={toggleMic} type='button'>
            {micActive ? (
              <Mic className='size-12 text-white hover:text-orange-600 bg-white/5 p-3 rounded-full' />
            ) : (
              <MicOff className='size-6 text-white hover:text-orange-600' />
            )}
          </button>
          <button onClick={toggleCamera} type='button'>
            {cameraActive ? (
              <Camera className='size-12 text-white hover:text-orange-600 bg-white/5 p-3 rounded-full' />
            ) : (
              <CameraOff className='size-6  text-white hover:text-orange-600' />
            )}
          </button>
        </div>
        <button
          onClick={leaveRoom}
          className='bg-red-600 px-3.5 py-2 rounded-lg'
        >
          Leave
        </button>
      </div>
      <div className=' grow flex flex-col md:flex-row mt-4 md:mt-0 md:gap-y-0 gap-y-6 md:gap-x-4'>
        <div className='flex-[0.5] flex flex-col  justify-center'>
          <div className='border min-h-[25rem] h-auto rounded-xl relative p-1 object-cover'>
            <video autoPlay ref={yourVideo} muted className='rounded-xl' />

            <span className='absolute top-0 left-0 bg-orange-600 px-2 text-xs py-1 rounded-tl-xl'>
              {you.username}
            </span>
          </div>
        </div>
        <div className='flex-[0.5] flex flex-col justify-center'>
          <div className='relative border h-full md:h-[25rem] rounded-xl'>
            <video autoPlay ref={partnerVideo} />
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
